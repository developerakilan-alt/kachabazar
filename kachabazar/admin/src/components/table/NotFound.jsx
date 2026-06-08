import React from "react";
import noResult from "@/assets/img/no-result.svg";

const NotFound = ({ title }) => {
  return (
    <div className="text-center justify-center align-middle mx-auto p-5 my-5">
      <img className="my-4 block mx-auto" src={noResult} alt="no-result" width="400" />
      <h2 className="text-lg text-center mt-2 font-medium font-serif text-muted-foreground">
        Sorry, we can not find this {title}
        <span role="img" aria-labelledby="img">
          😞
        </span>
      </h2>
    </div>
  );
};

export default NotFound;
