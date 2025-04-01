import Head from "next/head";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Toast from "@/components/Toast";
import Loader from "@/components/Loader";
import { FiArrowLeft, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { ProductJsonLd } from "next-seo";
import type { Product } from "@/types/product";

interface ProductPageProps {
  product: Product;
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async ({ params }) => {
  if (!params?.id) {
    return { notFound: true };
  }

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);
    if (!res.ok) throw new Error("Product not found");
    
    const product: Product = await res.json();
    return { props: { product } };
  } catch {
    return { notFound: true };
  }
};

export default function ProductPage({ product }: ProductPageProps) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState({ delete: false, edit: false });
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setIsLoading(prev => ({ ...prev, delete: true }));
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${product.id}`, {
        method: "DELETE",
      });
      if (res.ok) setIsDeleted(true);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
    }
  };

  if (isDeleted) {
    return (
      <>
        <Toast message="Product deleted successfully!" type="success" />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Product Deleted</h1>
            <p className="text-gray-600 mb-6">The product has been successfully removed.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
     <Head>
  <title>{product.title} | E-commerce Store</title>
  <meta name="description" content={product.description} />
  <meta name="keywords" content="online store, buy products, best deals, fashion, electronics, accessories" />
  <meta name="author" content="E-commerce Store" />
  <meta property="og:title" content={`${product.title} | E-commerce Store`} />
  <meta property="og:description" content={product.description} />
  <meta name="robots" content="index, follow" />

  {/* Structured Data for SEO */}
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "brand": { "@type": "Brand", "name": "E-commerce Store" },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "https://schema.org/InStock",
    }
  }) }} />
</Head>


      {/* Structured Data for SEO */}
      <ProductJsonLd
        productName={product.title}
        images={[product.image]}
        description={product.description}
        brand="E-commerce Store"
        reviews={[
          {
            author: "Customer",
            datePublished: new Date().toISOString(),
            reviewBody: "Highly rated product",
            name: "Customer Review",
            reviewRating: {
              bestRating: "5",
              ratingValue: product.rating?.rate.toString() ?? "1",
              worstRating: "1"
            }
          }
        ]}
        aggregateRating={{
          ratingValue: product.rating?.rate.toString() ?? "1",
          reviewCount: product.rating?.count.toString() ?? "0"
        }}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb Navigation */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <FiArrowLeft className="mr-2" /> Back to Products
                </Link>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="relative w-full h-96 md:h-[480px] rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  priority
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3 capitalize">
                  {product.category}
                </span>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-4">
                    <FiStar className="text-amber-400 fill-amber-400 mr-1" />
                    <span className="font-medium">{product.rating?.rate ?? 0}</span>
                    <span className="text-gray-500 ml-1">({product.rating?.count ?? 0} reviews)</span>
                  </div>
                </div>
                
                <p className="text-2xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>
                
                <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
                
                <div className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setIsLoading(prev => ({ ...prev, edit: true }));
                        router.push(`/products/edit/${product.id}`);
                      }}
                      className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      {isLoading.edit ? (
                        <Loader size={20} color="currentColor" />
                      ) : (
                        <>
                          <FiEdit2 size={18} /> Edit
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleDelete}
                      disabled={isLoading.delete}
                      className="flex items-center justify-center gap-2 bg-white border border-red-100 text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 transition-all"
                    >
                      {isLoading.delete ? (
                        <Loader size={20} color="currentColor" />
                      ) : (
                        <>
                          <FiTrash2 size={18} /> Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}