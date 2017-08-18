const request = require('request-promise');
const urls = require('./urls');
const toFile = require('./toFile');
const {
  formatItem
  ,formatPayment
  ,formatPaymentWithPayerCosts
} = require('./formatters');

request(urls.item) // get item
.then(item_raw => {

  const data = {
    item: formatItem(JSON.parse(item_raw))
  }
  request(urls.payment_methods) // get payment methods
  .then(payments_raw => {

    const payments = JSON.parse(payments_raw)
    data.payments = payments
    .filter(p => p.payment_type_id !== 'credit_card')
    .map(formatPayment)

    const promises = payments
    .filter(p => p.payment_type_id === 'credit_card')
    .map(p => request(`${urls.payment_methods}/${p.id}`).then(JSON.parse))

    Promise.all(promises) // get payment details for credict card types
    .then(res => {
      data.payments = data.payments.concat(res
        .map(formatPaymentWithPayerCosts)
        .map(p => {
          p.payer_costs = p.payer_costs.map(p => p.installments).reduce((a,b) => {
            return a < b ? b : a
          }, 0)
          return p
        }))
    })
    .then(() => {
      request(`${urls.user}/${data.item.seller_id}`) // get seller
      .then(JSON.parse)
      .then(seller => {
        data.item.seller_nickname = seller.nickname
        toFile(data) // generate file
      })
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
})
.catch(err => console.log(err))
