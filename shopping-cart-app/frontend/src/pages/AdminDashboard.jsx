import React, { useEffect, useMemo, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";
import {
  createProduct,
  deleteProduct,
  getProducts,
  uploadProductImage,
  updateProduct,
} from "../services/productService";
import { formatLkr } from "../utils/currency";
import { productImageSrc } from "../utils/images";
import { formatProductStock, formatWeight, isWeightedProduct } from "../utils/productUnits";
import "../styles/Admin.css";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  discount_percent: "",
  stock_quantity: "",
  unit_grams: "",
  subcategory: "",
  image_url: "",
  category_id: "",
};

function messageFrom(error, fallback) {
  return error.response?.data?.message || fallback;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [productImageFile, setProductImageFile] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCatalog = async () => {
    const [catalog, categoryList] = await Promise.all([getProducts(), getCategories()]);
    setProducts(catalog);
    setCategories(categoryList);
  };

  useEffect(() => {
    loadCatalog().catch(() => setError("Unable to load catalog management data."));
  }, []);

  const resetMessages = () => {
    setError("");
    setMessage("");
  };

  const resetProductForm = () => {
    setProductForm(emptyProduct);
    setProductImageFile(null);
    setEditingProductId(null);
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    try {
      let productPayload = productForm;
      if (productImageFile) {
        const uploadedImage = await uploadProductImage(productImageFile);
        productPayload = { ...productForm, image_url: uploadedImage.image_url };
      }
      if (editingProductId) {
        await updateProduct(editingProductId, productPayload);
        setMessage("Product updated successfully.");
      } else {
        await createProduct(productPayload);
        setMessage("Product added successfully.");
      }
      resetProductForm();
      await loadCatalog();
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to save product."));
    }
  };

  const editProduct = (product) => {
    resetMessages();
    setProductImageFile(null);
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discount_percent: product.discount_percent || "",
      stock_quantity: product.stock_quantity,
      unit_grams: product.unit_grams || "",
      subcategory: product.subcategory || "",
      image_url: product.image_url || "",
      category_id: product.category_id || "",
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.type.startsWith("image/")) {
      setError("Choose a valid image file.");
      event.target.value = "";
      return;
    }
    setProductImageFile(file);
  };

  const imagePreview = useMemo(() => {
    if (productImageFile) {
      return URL.createObjectURL(productImageFile);
    }
    return productForm.image_url ? productImageSrc(productForm.image_url) : "";
  }, [productImageFile, productForm.image_url]);

  useEffect(() => {
    if (!productImageFile || !imagePreview) return undefined;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview, productImageFile]);

  const handleProductDelete = async (productId) => {
    resetMessages();
    try {
      await deleteProduct(productId);
      if (editingProductId === productId) resetProductForm();
      setMessage("Product deleted successfully.");
      await loadCatalog();
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to delete product."));
    }
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, categoryName);
        setMessage("Category updated successfully.");
      } else {
        await createCategory(categoryName);
        setMessage("Category added successfully.");
      }
      setEditingCategoryId(null);
      setCategoryName("");
      await loadCatalog();
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to save category."));
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    resetMessages();
    try {
      await deleteCategory(categoryId);
      if (editingCategoryId === categoryId) {
        setEditingCategoryId(null);
        setCategoryName("");
      }
      setMessage("Category deleted. Products in it are now uncategorized.");
      await loadCatalog();
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to delete category."));
    }
  };

  return (
    <section className="admin-page">
      <header className="section-header">
        <h1>Market desk</h1>
        <p>Curate departments, pricing, stock levels, and today's display.</p>
      </header>
      {error && <p className="admin-error">{error}</p>}
      {message && <p className="admin-success">{message}</p>}
      <div className="admin-stats">
        <div className="admin-stat">
          <span>Products</span>
          <strong>{products.length}</strong>
        </div>
        <div className="admin-stat">
          <span>Categories</span>
          <strong>{categories.length}</strong>
        </div>
      </div>

      <div className="admin-layout">
        <form className="admin-card product-form" onSubmit={handleProductSubmit}>
          <h2>{editingProductId ? "Edit product" : "Add product"}</h2>
          <label>
            Product name
            <input
              onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
              required
              value={productForm.name}
            />
          </label>
          <label>
            Description
            <textarea
              onChange={(event) =>
                setProductForm({ ...productForm, description: event.target.value })
              }
              rows="3"
              value={productForm.description}
            />
          </label>
          <div className="form-row">
            <label>
              Price (Rs.)
              <input
                min="0"
                onChange={(event) =>
                  setProductForm({ ...productForm, price: event.target.value })
                }
                required
                step="0.01"
                type="number"
                value={productForm.price}
              />
            </label>
            <label>
              Discount %
              <input
                max="95"
                min="0"
                onChange={(event) =>
                  setProductForm({ ...productForm, discount_percent: event.target.value })
                }
                placeholder="0"
                step="0.01"
                type="number"
                value={productForm.discount_percent}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Stock portions
              <input
                min="0"
                onChange={(event) =>
                  setProductForm({ ...productForm, stock_quantity: event.target.value })
                }
                required
                type="number"
                value={productForm.stock_quantity}
              />
            </label>
            <label>
              Weight per portion in grams
              <input
                min="1"
                onChange={(event) =>
                  setProductForm({ ...productForm, unit_grams: event.target.value })
                }
                placeholder="For example: 500. Leave blank for items."
                type="number"
                value={productForm.unit_grams}
              />
            </label>
          </div>
          <label>
            Category
            <select
              onChange={(event) =>
                setProductForm({ ...productForm, category_id: event.target.value })
              }
              value={productForm.category_id}
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Subcategory
            <select
              onChange={(event) =>
                setProductForm({ ...productForm, subcategory: event.target.value })
              }
              value={productForm.subcategory}
            >
              <option value="">No subcategory</option>
              <option value="Cakes">Cakes</option>
              <option value="Bread">Bread</option>
              <option value="Pastries">Pastries</option>
              <option value="Buns">Buns</option>
              <option value="Dairy Products">Dairy Products</option>
              <option value="Ice Cream">Ice Cream</option>
              <option value="Biscuits">Biscuits</option>
              <option value="Sweets">Sweets</option>
              <option value="Beverages">Beverages</option>
            </select>
          </label>
          <label>
            Product image
            <input accept="image/*" onChange={handleImageChange} type="file" />
          </label>
          {imagePreview && (
            <div className="image-preview">
              <img alt="Selected product preview" src={imagePreview} />
              <span>{productImageFile ? productImageFile.name : "Current product image"}</span>
            </div>
          )}
          <div className="form-actions">
            <button className="button" type="submit">
              {editingProductId ? "Update product" : "Add product"}
            </button>
            {editingProductId && (
              <button className="button secondary" onClick={resetProductForm} type="button">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-card categories-panel">
          <h2>Categories</h2>
          <form className="category-form" onSubmit={handleCategorySubmit}>
            <input
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Category name"
              required
              value={categoryName}
            />
            <button className="button" type="submit">
              {editingCategoryId ? "Save" : "Add"}
            </button>
          </form>
          {editingCategoryId && (
            <button
              className="text-button"
              onClick={() => {
                setEditingCategoryId(null);
                setCategoryName("");
              }}
              type="button"
            >
              Cancel editing
            </button>
          )}
          <div className="category-list">
            {categories.map((category) => (
              <div key={category.id}>
                <span>{category.name}</span>
                <button
                  className="text-button"
                  onClick={() => {
                    setEditingCategoryId(category.id);
                    setCategoryName(category.name);
                  }}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="text-button danger"
                  onClick={() => handleCategoryDelete(category.id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card product-table">
        <h2>Product inventory</h2>
        {products.map((product) => (
          <div className="product-row" key={product.id}>
            <div>
              <strong>{product.name}</strong>
              <span>
                {product.category_name || "Uncategorized"}
                {product.subcategory && ` / ${product.subcategory}`}
              </span>
            </div>
            <span>
              {formatLkr(product.price)}
              {Number(product.discount_percent) > 0 && ` (${Number(product.discount_percent)}% off)`}
            </span>
            <span>
              {formatProductStock(product)} in stock
              {isWeightedProduct(product) && ` (${formatWeight(product.unit_grams)} portions)`}
            </span>
            <button className="text-button" onClick={() => editProduct(product)} type="button">
              Edit
            </button>
            <button
              className="text-button danger"
              onClick={() => handleProductDelete(product.id)}
              type="button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
