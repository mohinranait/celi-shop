'use client';

import { Suspense } from "react";
import SuccessPageCompo from "./components/SuccessPageCompo";


export default function OrderSuccessPage() {



  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageCompo />
    </Suspense>
  );
}