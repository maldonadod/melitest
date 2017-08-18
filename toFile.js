const fs = require('fs');

function Item(item) {
  const text = `
  - id: ${item.id}
  - seller_nickname: ${item.seller_nickname}
  - site_id: ${item.site_id}
  - title: ${item.title}
  - thumbnail: ${item.thumbnail}
  - price: ${item.price}
  - currency_id: ${item.currency_id}
  - available_quantity: ${item.available_quantity}
  - shipping_mode: ${item.shipping_mode}`
  return text
}
function Payment(payment) {
  let text = `
  - id: ${payment.payment_id}
  - name: ${payment.payment_name}
  - type_id: ${payment.payment_type_id}`
  if (payment.payer_costs) {
    text += `
    - payer_costs: ${payment.payer_costs}`
  }
  return text
}
function toFile(data) {
  const text = fs.createWriteStream('./output.txt')
  text.write(Item(data.item) + '\n')
  data.payments.map(payment => text.write(Payment(payment) + '\n'))
  text.write(`\n Generated at: ${new Date().toString()}`)
}

module.exports = toFile
