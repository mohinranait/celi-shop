import React from 'react'

const Breadcrumb = ({ name }: { name: string }) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <a href="#" className="hover:text-slate-900">Home</a>
          <span>/</span>
          <a href="#" className="hover:text-slate-900">Products</a>
          <span>/</span>
          <span className="text-slate-900 font-medium">{name}</span>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb