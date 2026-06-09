
import { Main } from "@/components/ui/main";
import { FaqList } from "./components/FaqList";
import { Navbar } from "@/components/shared/NavBar";

function FaqPage() {
  return (
    <>
      <Navbar fixed />
      <Main>
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              FAQ Management System
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
              Create, edit, and manage your frequently asked questions
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <FaqList />
          </div>
        </div>
      </Main>
    </>
  );
}
export default FaqPage;
