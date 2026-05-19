import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_DB_URL
        await mongoose.connect(dbURI)
        console.log('MongoDB connected')
    } catch (error) {
        console.log('Error connecting to MongoDB', error)
        process.exit(1)
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect()
        console.log('MongoDB disconnected')
    } catch (error) {
        console.log('Error disconnecting from MongoDB', error)
        process.exit(1)
    }
}
