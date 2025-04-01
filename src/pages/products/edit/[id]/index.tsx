import Head from "next/head";
import { GetServerSideProps } from "next";
import ProductForm from "@/components/ProductForm";
import type { Product } from "@/types/product";
import { useState } from "react";
import { useRouter } from "next/router";
import Toast from "@/components/Toast";

interface EditProductPageProps {
  product: Product;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) {
    return { notFound: true };
  }

  const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);
  const product = await res.json();

  return { props: { product } };
};

export default function EditProductPage({ product }: EditProductPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (updatedProduct: Product) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `https://fakestoreapi.com/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push(`/products/${product.id}`);
        }, 1500);
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Edit product error:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Product | E-commerce Store</title>
        <meta
          name="description"
          content="Edit product details for the e-commerce store."
        />
      </Head>

      {showSuccess && (
        <Toast 
          message="Product updated successfully!" 
          type="success" 
          onClose={() => setShowSuccess(false)}
        />
      )}

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit as (product: Product | FormData) => Promise<void>}
        isSubmitting={isSubmitting}
        formTitle="Edit Product"
        submitButtonText="Update Product"
        pageType="edit"
      />
    </>
  );
}