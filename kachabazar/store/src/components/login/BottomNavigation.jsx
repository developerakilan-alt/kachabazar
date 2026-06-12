import Link from "next/link";

const BottomNavigation = ({ route, pageName, or, desc, loginTitle, hideSignupText }) => {
  return (
    <>
      <div className="text-center mt-8 pb-2">
        <p className="text-muted-foreground text-sm">
          {desc ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            href={route}
            className="text-primary hover:text-primary font-semibold hover:underline"
          >
            {pageName}
          </Link>
        </p>
      </div>
    </>
  );
};

export default BottomNavigation;
