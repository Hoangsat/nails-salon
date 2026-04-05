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
        title="Visit, message, or book with the studio"
        description="Find the studio address, opening hours, and direct contact links for booking questions or quick messages."
      />
      <ContactShowcaseSection
        salon={salon}
        workingHours={workingHours.map((entry) => formatWorkingHoursEntry(entry))}
      />
    </>
  );
}
