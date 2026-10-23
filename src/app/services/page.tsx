import { services, teams } from "@/data/placeholder";
import ServiceCard from "@/components/ServiceCard";

export default function ServicesPage() {
  const grouped = teams.map((team) => ({
    team,
    services: services.filter((s) => s.team === team.id),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Services</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {services.length} services across {teams.length} teams
        </p>
      </div>

      {grouped.map(({ team, services: teamServices }) => (
        <div key={team.id}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: team.color }} />
            {team.name}
            <span className="text-xs text-[var(--text-muted)] font-normal">
              ({teamServices.length} services · Lead: {team.lead})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamServices.map((svc) => (
              <ServiceCard key={svc.id} service={svc} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
