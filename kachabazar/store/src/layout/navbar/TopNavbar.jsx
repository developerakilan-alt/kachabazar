
const TopNavbar = () => {
  return (
    <div className="hidden lg:block bg-[#D97706]">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
        <div className="py-1.5 text-xs flex justify-between items-center">
          <a
            href="mailto:hautecouturejewellery@gmail.com"
            className="tracking-[0.25em] uppercase text-[10px] font-light text-neutral-400 hover:text-white transition-colors"
          >
            SUPPORT: hautecouturejewellery@gmail.com
          </a>
          <div className="flex items-center gap-5 text-neutral-500">
            {/* <a className="hover:text-white transition-colors text-[11px] tracking-wide" href="/about-us">About</a> */}
            {/* <a className="hover:text-white transition-colors text-[11px] tracking-wide" href="/contact-us">Contact</a> */}
            <a className="hover:text-white transition-colors text-[11px] tracking-wide" href="/user/my-account">
              Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
