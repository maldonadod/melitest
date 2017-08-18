function formatItem(item) {
  const {id, seller_id, site_id, title, thumbnail, price, currency_id, available_quantity, shipping} = item
  const shipping_mode = shipping.mode
  return {id, seller_id, site_id, title, thumbnail, price, currency_id, available_quantity, shipping_mode}
}

function formatPayment(payment) {
  const {id, name, payment_type_id} = payment
  return {payment_id: id, payment_name: name, payment_type_id}
}

function formatPaymentWithPayerCosts(payment) {
  const formatted = formatPayment(payment)
  formatted.payer_costs = payment.payer_costs
  return formatted
}

module.exports = {
  formatItem
  ,formatPayment
  ,formatPaymentWithPayerCosts
}
