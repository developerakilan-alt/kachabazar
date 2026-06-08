import { Card, CardContent } from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const CardItemTwo = ({
  mode,
  title,
  Icon,
  className,
  color1,
  color2,
  color3,
  price,
  cash,
  card,
  credit,
  loading,
  title2,
}) => {
  const { t } = useTranslation();
  const { formatPrice } = useUtilsFunction();

  return (
    <>
      {loading ? (
        <Skeleton
          count={4}
          height={40}
          className="bg-muted rounded-xl"
          baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
          highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
        />
      ) : (
        <Card
          className={`group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-md ${className || ''}`}
        >
          {/* Blurred Background Gradient Blobs */}
          {/* We use color1, color2, color3 to define the 3 unique colors per card */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top Right Blob */}
            <div 
              className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[50px] opacity-60 mix-blend-multiply dark:mix-blend-screen transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 ${color1 || 'bg-blue-300'}`}
            />
            {/* Top Left Blob */}
            <div 
              className={`absolute -top-8 -left-8 w-40 h-40 rounded-full blur-[45px] opacity-60 mix-blend-multiply dark:mix-blend-screen transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 ${color2 || 'bg-purple-300'}`}
            />
            {/* Top Middle Blob (The 3rd color bridging the gap) */}
            <div 
              className={`absolute top-0 right-1/4 w-44 h-44 rounded-full blur-[55px] opacity-50 mix-blend-multiply dark:mix-blend-screen transition-all duration-700 group-hover:-translate-y-2 group-hover:scale-110 ${color3 || 'bg-cyan-200'}`}
            />
          </div>

          <CardContent className="p-5 h-full flex flex-col justify-between relative z-10 w-full mb-0 bg-transparent">
            {/* Top Icon Area */}
            <div className="flex justify-between items-start mb-5">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/70 dark:bg-black/20 text-gray-800 dark:text-gray-200 group-hover:bg-white dark:group-hover:bg-black/40 transition-colors duration-300 shadow-sm backdrop-blur-md">
                <Icon size={16} />
              </div>
            </div>

            {/* Price section */}
            <div className="mt-1 mb-1">
              <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-1">
                {formatPrice(price)}
              </p>
              
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {title2 ? t(`${title2}`) : <Skeleton width={100} />}
                </span>
              </div>
            </div>

            {/* Existing Cash/Card/Credit logic */}
            {(title === "Today Order" || title === "Yesterday Order") && (
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60 text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-start gap-0.5">
                  <span>{t("Cash")}</span>
                  <span className="text-gray-800 font-semibold dark:text-gray-200">{formatPrice(cash)}</span>
                </div>
                <div className="flex flex-col items-start gap-0.5 border-l border-gray-200 dark:border-gray-700/60 pl-4">
                  <span>{t("Card")}</span>
                  <span className="text-gray-800 font-semibold dark:text-gray-200">{formatPrice(card)}</span>
                </div>
                <div className="flex flex-col items-start gap-0.5 border-l border-gray-200 dark:border-gray-700/60 pl-4">
                  <span>{t("Credit")}</span>
                  <span className="text-gray-800 font-semibold dark:text-gray-200">{formatPrice(credit)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CardItemTwo;
