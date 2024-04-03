
import { createItem, getItemById, listItems, updateItem, deleteItem } from '../dataLayer/TodoAccess.mjs'
import { filePreSignedUrl } from '../fileStorage/attachmentUtils.mjs';



export const validateTodoItem = (todoItem) => {
    if (!todoItem || typeof todoItem !== 'object') {
        throw new Error('Invalid todo item');
    }
    if (!todoItem.name || typeof todoItem.name !== 'string' || todoItem.name.trim() === '') {
        throw new Error('Todo item name is required');
    }
    // Add more validation rules as needed

    return true
}

export const getTodos = async (userId, context) => {

    context.logger.info("Get todos for user", userId)


    try {
        context.logger.info("Call to dynamo function")
        const items = await listItems(userId, context)

        context.logger.info("Items returned: ", items)
        return items

    } catch (error) {
        context.logger.error("could not retrieve list", { error })
        throw error

    }

}

export const getTodo = async (userId, todoId, context) => {
    context.logger.info("Get todo element with id ", { todoId })
    try {
        context.logger.info("Call to dynamo function")
        const item = await getItemById(userId, todoId, context)
        return item
    } catch (error) {
        context.logger.error("Could not get Item", { error })
        throw error
    }

}

export const createTodo = async (item, context) => {
    context.logger.info("Create item:", item)
    try {
        if (!validateTodoItem(item)) {

        }
        context.logger.info("Send request to datalayer")

        const created_item = await createItem(item, context)

        context.logger.info("Item returned by datalayer:", { created_item })

        return created_item
    } catch (error) {
        context.logger.error(" Could not create item", { item: item, error: error })
        throw error
    }
}

export const deleteTodo = async (userId, todoId, context) => {
    context.logger.info("Delete item with itemID:", { todoId })
    try {
        if (!todoId || typeof todoId !== 'string') {
            throw new Error('Invalid todo ID');
        }
        context.logger.info("Call to dynamo function")

        await deleteItem(userId, todoId, context)
        context.logger.info("Item deleted Successfully")

        return true
    } catch (error) {
        context.logger.error("Error during item deletion:", { error })
        throw error
    }
}


export const updateTodo = async (item,context) => {

    context.logger.info("Update item received to save :", item)

    try {
        if (!validateTodoItem(item)) {

        }

        const updatedItem = await updateItem(item,context)
        context.logger.info("Update item received saved :", { updatedItem })
        return updatedItem
    } catch (error) {
        context.logger.error(error)
        throw error
    }

}

export const generateUploadUrl = async (todoId,context) => {
    context.logger.info("Generate <presignedurl for  :", todoId)

    try {
        const preSignegUrl = await filePreSignedUrl(todoId,context)
        return preSignegUrl

    } catch (error) {
        context.logger.error("Error Occured", {error})
        throw error
    }

}
