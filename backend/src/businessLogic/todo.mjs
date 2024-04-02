
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

export const getTodos = async (userId) => {

    console.info( "Get todos for user", userId)
    console.info( "Call to dynamo function")

    try {

        const items = await listItems(userId)

        console.info("Items returned: ", items)
        return items

    } catch (error) {
        console.error("could not retrieve list")
        console.error(error)
        throw error

    }




}

export const getTodo = async (todoId) => {

   try {
     const item = await getItemById(todoId)
     return item
   } catch (error) {
    console.info(error)
    throw error
   }

}

export const createTodo = async (item) => {
    console.info("Create item:", item)
    try {
        if (!validateTodoItem(item)) {

        }
    console.info("Send request to datalayer")
    const created_item = await createItem(item)
    console.info("Item returned by datalayer:", created_item)

    return created_item
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deleteTodo = async (userId,todoId) => {
    console.log("Delete item with itemID:", todoId)
    try {
        if (!todoId || typeof todoId !== 'string') {
            throw new Error('Invalid todo ID');
        }

        await deleteItem(userId,todoId)
        console.log("Item deleted Successfully")

        return true
    } catch (error) {
        console.info(error)
        throw error
    }
}


export const updateTodo = async (item) => {

    console.info("Update item received to save :", item)

   try {
     if (!validateTodoItem(item)) {

     }

     const updatedItem = await updateItem(item)
     console.info("Update item received saved :", updateItem)
     return updatedItem
   } catch (error) {
    console.info(error)
    throw error
   }

}

export const generateUploadUrl = async (todoId) => {

   try {
     const preSignegUrl = await  filePreSignedUrl(todoId)
     return preSignegUrl

   } catch (error) {
    console.error(error)
        throw error
   }

}
