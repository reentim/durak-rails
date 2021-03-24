import { createConsumer } from '@rails/actioncable'

const URL = 'wss://durak-rails.herokuapp.com/cable'
const consumer = createConsumer(URL)

export default consumer
