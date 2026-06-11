import React from "react";

import PageHeader from "@components/header/PageHeader";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";

const Loading = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={"Refund Policy"} />
      <div className="relative z-10 mt-4 bg-background text-foreground">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
          <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
            <CMSkeletonTwo count={15} height={15} loading={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
