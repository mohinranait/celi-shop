import FaqComponent from "@/components/shared/Faqs"


export const FaqPageComponent = () => {
  return (
    <section className="relative py-10 bg-linear-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-pink-100 to-orange-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-indigo-100 to-cyan-100 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl sm:text-5xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className=" text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Quick answers to common questions about our emergency patient
              transport services.
            </p>
          </div>
          <FaqComponent />
        </div>
      </div>
    </section>
  )
}

export default FaqComponent