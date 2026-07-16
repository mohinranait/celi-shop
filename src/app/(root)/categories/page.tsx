'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/redux/service/categories";
import { ICategory } from "@/redux/service/categories/type";

interface ITreeCategory extends ICategory {
  children?: ITreeCategory[];
}

// Helper function to build nested structure
function buildCategoryTree(categories: ICategory[] = []): ITreeCategory[] {
  const categoryMap = new Map<string, ITreeCategory>();
  const rootCategories: ITreeCategory[] = [];

  // First pass: create map with children array
  categories.forEach((cat) => {
    categoryMap.set(cat._id, { ...cat, children: [] });
  });

  // Second pass: build tree
  categories.forEach((cat) => {
    const category = categoryMap.get(cat._id)!;

    if (!cat.parentId) {
      rootCategories.push(category);
    } else {
      const parent = categoryMap.get(cat.parentId);
      if (parent?.children) {
        parent.children.push(category);
      }
    }
  });

  return rootCategories;
}

export default function CategoriesPage() {
  const { data, isLoading } = useGetCategoriesQuery(
    `page=1&limit=1000&status=true&isDelete=false`
  );

  const categories = data?.data || [];
  const categoryTree = buildCategoryTree(categories);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Shop by Categories
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our wide range of products organized in a clear hierarchy
          </p>
        </div>

        {categoryTree.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No categories found</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {categoryTree.map((category) => (
              <Card
                key={category._id}
                className="overflow-hidden  transition-all duration-300 border border-gray-200 hover:border-primary group"
              >
                {/* Top Level Header */}
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-start gap-4">
                    {category.thumbnail && (
                      <Link href={`/shop?category=${category._id}`}>
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border shadow-sm shrink-0">
                          <Image
                            src={category.thumbnail}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </Link>
                    )}

                    <div className="pt-1">
                      <h2 className="text-base font-bold text-gray-900 leading-tight">
                        {category.name}
                      </h2>
                      <Badge variant="secondary" className="mt-2 font-medium">
                        {category.children?.length || 0} Sub Categories
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {category.children && category.children.length > 0 && (
                  <CardContent className="p-6 pt-2">
                    <div className="space-y-8">
                      {category.children.map((level1) => (
                        <div key={level1._id} className="border-l-2 border-primary/30 pl-4">
                          {/* Level 1 */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                            <Link href={`/shop?category=${level1._id}`}>
                              <h3 className="font-semibold text-sm text-gray-800">
                                {level1.name}
                              </h3>
                            </Link>
                          </div>

                          {/* Level 2 */}
                          {level1.children && level1.children.length > 0 && (
                            <div className="pl-6 grid grid-cols-2 gap-y-2.5 gap-x-4">
                              {level1.children.map((level2) => (
                                <Link
                                  key={level2._id}
                                  href={`/shop?category=${level2._id}`}
                                  className="text-gray-700 hover:text-primary hover:underline transition-all flex items-center gap-1.5 text-[15px] py-0.5 group/link"
                                >
                                  <span className="text-primary/70 group-hover/link:text-primary">→</span>
                                  <span>{level2.name}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}