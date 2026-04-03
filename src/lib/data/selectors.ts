import type { Review, SalonService, StaffMember } from "@/types/salon";

export function getFeaturedServices(services: SalonService[], limit?: number) {
  const featured = services.filter((service) => service.isFeatured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getFeaturedStaff(staff: StaffMember[], limit?: number) {
  const featured = staff.filter((member) => member.isFeatured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function groupServicesByCategory(services: SalonService[]) {
  return services.reduce<Array<{ category: string; services: SalonService[] }>>((groups, service) => {
    const existing = groups.find((group) => group.category === service.category);

    if (existing) {
      existing.services.push(service);
      return groups;
    }

    groups.push({
      category: service.category,
      services: [service],
    });

    return groups;
  }, []);
}

export function getAverageReviewRating(reviews: Review[]) {
  if (!reviews.length) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
}
