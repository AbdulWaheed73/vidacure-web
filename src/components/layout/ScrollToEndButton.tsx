import { useEffect, useState } from "react";
import { ChevronsDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

type ScrollToEndButtonProps = {
  /** id of the element at the end of the page to scroll to */
  targetId: string;
};

/**
 * Floating button (bottom-right) that quickly scrolls the user to the end of
 * the page. It hides itself once the target (footer) is in view.
 */
const ScrollToEndButton = ({ targetId }: ScrollToEndButtonProps) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [targetId]);

  const handleClick = () => {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  if (!visible) return null;

  return (
    <Button
      size="icon"
      onClick={handleClick}
      aria-label={t("common.scrollToEnd")}
      className="fixed bottom-6 right-6 z-50 size-12 rounded-full bg-teal-700 text-white shadow-lg ring-1 ring-white/20 transition-all duration-200 hover:bg-teal-800 hover:scale-105"
    >
      <ChevronsDown className="size-6" />
    </Button>
  );
};

export default ScrollToEndButton;