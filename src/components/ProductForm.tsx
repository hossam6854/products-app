import { useState, useEffect } from "react";
import {
  FiSave,
  FiArrowLeft,
  FiUpload,
  FiImage,
  FiDollarSign,
} from "react-icons/fi";
import { useRouter } from "next/router";
import Toast from "@/components/Toast";
import Loader from "@/components/Loader";
import type { Product } from "@/types/product";
import Image from "next/image";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (product: FormData | Product) => Promise<void>;
  isSubmitting: boolean;
  formTitle: string;
  submitButtonText: string;
  successMessage?: string;
  showBackButton?: boolean;
}

export default function ProductForm({
  initialData = {
    id: 0,
    title: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    rating: { rate: 0, count: 0 },
  },
  onSubmit,
  isSubmitting,
  formTitle,
  submitButtonText,
  successMessage,
  showBackButton = true,
}: ProductFormProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(initialData);
  const [imagePreview, setImagePreview] = useState(initialData.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setProduct(initialData);
    setImagePreview(initialData.image || "");
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!product.title.trim()) newErrors.title = "Title is required";
    if (!product.description.trim())
      newErrors.description = "Description is required";
    if (product.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!product.category) newErrors.category = "Category is required";
    if (!imagePreview && !imageFile && !product.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      const numValue = parseFloat(value);
      setProduct((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please upload an image file" }));
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setErrors((prev) => ({ ...prev, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (imageFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", product.title);
        formData.append("description", product.description);
        formData.append("price", product.price.toString());
        formData.append("category", product.category);

        await onSubmit(formData);
      } else {
        // Regular JSON payload for URL-based image
        await onSubmit(product);
      }

      if (successMessage) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Failed to submit form. Please try again.",
      }));
    }
  };

  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {showBackButton && (
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center text-sm mb-6 font-medium text-gray-700 hover:text-blue-600">
          <FiArrowLeft /> Back to Products
        </button>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{formTitle}</h2>

          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload/Preview */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Product Image *
              </label>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/3">
                  <div
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      errors.image ? "border-red-300" : "border-gray-300"
                    } border-dashed flex items-center justify-center`}
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <FiImage className="mx-auto text-gray-400 h-12 w-12" />
                        <span className="mt-2 block text-sm text-gray-600">
                          No image selected
                        </span>
                      </div>
                    )}
                  </div>
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                  )}
                </div>

                <div className="w-full sm:w-2/3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={product.image}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        errors.image ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="https://example.com/image.jpg"
                      disabled={!!imageFile}
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or upload image *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <FiUpload className="mr-2" />
                        <span>Choose a file</span>
                      </label>
                    </div>
                    {imageFile && (
                      <p className="mt-1 text-sm text-gray-500">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={product.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter product title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={product.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-500" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={product.price || ""}
                    onChange={handleChange}
                    className={`block w-full pl-8 pr-12 py-2 border ${
                      errors.price ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.category ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} color="white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    {submitButtonText}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
