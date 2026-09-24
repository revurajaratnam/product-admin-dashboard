export function validateLogin({ username, password }) {
  const errors = {};
  if (!username || !username.trim()) errors.username = "Username is required.";
  if (!password || !password.trim()) errors.password = "Password is required.";
  return errors;
}

export function validateProduct({ title, description, category, price, stock }) {
  const errors = {};

  if (!title || !title.trim()) errors.title = "Title is required.";
  if (!description || !description.trim())
    errors.description = "Description is required.";
  if (!category || !category.trim()) errors.category = "Category is required.";

  if (price === "" || price === null || price === undefined) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(Number(price)) || Number(price) < 0) {
    errors.price = "Price must be a number >= 0.";
  }

  if (stock === "" || stock === null || stock === undefined) {
    errors.stock = "Stock is required.";
  } else if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
    errors.stock = "Stock must be a whole number >= 0.";
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
