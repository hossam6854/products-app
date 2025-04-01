import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import ProductForm from "@/components/ProductForm";
import type { Product } from "@/types/product";
import Toast from "@/components/Toast";

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (product: Product) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...product,
          rating: { rate: 0, count: 0 } // Default rating for new products
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        throw new Error(data.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Create product error:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Product | E-commerce Store</title>
        <meta name="description" content="Add a new product to the e-commerce store." />
      </Head>

      {showSuccess && (
        <Toast 
          message="Product created successfully!" 
          type="success" 
          onClose={() => setShowSuccess(false)}
        />
      )}

      <ProductForm
        initialData={{
          id: 0,
          title: "",
          description: "",
          price: 0,
          image: "",
          category: "",
          rating: { rate: 0, count: 0 }
        }}
        onSubmit={handleSubmit as (product: Product | FormData) => Promise<void>}
        isSubmitting={isSubmitting}
        formTitle="Add New Product"
        submitButtonText="Create Product"
        pageType="new"
      />
    </>
  );
}