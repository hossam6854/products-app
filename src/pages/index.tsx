import Head from "next/head";
import { GetStaticProps } from "next";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";
import { useState, useMemo } from "react";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";

interface ProductsPageProps {
  products: Product[];
}

export const getStaticProps: GetStaticProps<ProductsPageProps> = async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  const products: Product[] = await res.json();

  return {
    props: { products },
    revalidate: 60,
  };
};

export default function Products({ products }: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Get all unique categories
  const categories = useMemo(() => {
    const allCategories = products.map((product) => product.category);
    return Array.from(new Set(allCategories));
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  return (
    <>
      <Head>
        <title>Products | E-commerce Store</title>
        <meta name="description" content="All available products in our online store." />
        <meta name="keywords" content="online store, buy products, best deals, fashion, electronics, accessories" />
        <meta name="author" content="E-commerce Store" />
        <meta property="og:title" content="Products | E-commerce Store" />
        <meta property="og:description" content="Browse our extensive collection of products with the best prices." />
        <meta name="robots" content="index, follow" />
      
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2">Our Products</h1>
        <p className="text-center text-gray-600 mb-8">Find exactly what you&apos;re looking for</p>
        
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FiX className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <FiFilter />
              Filters
            </button>
            
            {/* Category Filter - Desktop */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg transition ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg capitalize transition ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile Category Filter - Only shown when toggled */}
          {isMobileFiltersOpen && (
            <div className="mt-4 md:hidden grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setIsMobileFiltersOpen(false);
                }}
                className={`px-4 py-2 rounded-lg transition ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsMobileFiltersOpen(false);
                  }}
                  className={`px-4 py-2 rounded-lg capitalize transition ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
            >
              <FiX size={18} />
              Clear filters
            </button>
          )}
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}