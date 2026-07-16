import Link from 'next/link'
import React from 'react'

const Breadcrumb = ({ name }: { name: string }) => {
  return (
    <div className=" backdrop-blur-sm border-b bg-white border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <a href="#" className="hover:text-slate-900">Products</a>
          <span>/</span>
          <span className="text-accent-foreground font-medium">{name}</span>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb