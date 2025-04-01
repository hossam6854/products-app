import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import Loader from "./Loader";
import { useState } from "react";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className={`object-contain transition-transform duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          style={{ backgroundColor: "#f8fafc" }}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={false}
        />

        <div
          className={`absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center gap-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <Link
              href={`/products/${product.id}`}
              onClick={() => setIsLoading(true)}
            >
              <FiEye className="text-gray-700" size={18} />
            </Link>
          </button>
          <button
            className={`p-3 rounded-full shadow-md transition-colors ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <FiHeart className={isWishlisted ? "fill-current" : ""} size={18} />
          </button>
        </div>

        {/* Badge */}
        {product.rating && product.rating.rate > 4.5 && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {product.category}
          </span>
          <span className="flex items-center text-sm font-medium text-amber-500">
            <span className="mr-1">⭐</span> {product.rating?.rate ?? 0}
            <span className="text-gray-400 ml-1">
              ({product.rating?.count ?? 0})
            </span>
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link
            href={`/products/${product.id}`}
            onClick={() => setIsLoading(true)}
          >
            {product.title}
          </Link>
        </h3>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.price > 50 && (
              <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Free Shipping
              </span>
            )}
          </div>

          <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors">
            <FiShoppingCart size={18} />
          </button>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
          onClick={() => setIsLoading(true)}
        >
          {isLoading ? (
            <Loader size={20} color="white" />
          ) : (
            <>
              View Details
              <FiEye size={16} className="text-white" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
