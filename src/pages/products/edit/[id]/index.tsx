import Head from "next/head";
import { GetServerSideProps } from "next";
import ProductForm from "@/components/ProductForm";
import type { Product } from "@/types/product";
import { useState } from "react";

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

      if (!res.ok) {
        throw new Error("Failed to update product");
      }
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

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit as (product: Product | FormData) => Promise<void>}
        isSubmitting={isSubmitting}
        formTitle="Edit Product"
        submitButtonText="Update Product"
        successMessage="Product updated successfully!"
      />
    </>
  );
}