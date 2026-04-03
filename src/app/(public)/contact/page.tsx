import { PageIntro } from "@/components/sections/page-intro";
import { ContactShowcaseSection } from "@/components/sections/contact-showcase-section";
import { getPublicContactPageData } from "@/lib/data/public";
import { formatWorkingHoursEntry } from "@/lib/data/formatters";

export default async function ContactPage() {
  const { salon, workingHours } = await getPublicContactPageData();

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Make it easy for guests to visit, message, and book"
        description="Address, contact details, opening hours, and one-tap social/contact actions help guests reach the salon quickly and move confidently into booking."
      />
      <ContactShowcaseSection
        salon={salon}
        workingHours={workingHours.map((entry) => formatWorkingHoursEntry(entry))}
      />
    </>
  );
}
