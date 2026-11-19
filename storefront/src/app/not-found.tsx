import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="eyebrow text-muted">Error 404</p>
      <h1 className="display mt-3 text-[clamp(4rem,12vw,9rem)]">Fuera de ruta</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        La página que buscas no existe o cambió de lugar. Vuelve al inicio y
        encuentra tu próximo par.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Link href="/" className="btn btn-primary">
          Volver al inicio
          <ArrowRightIcon size={16} />
        </Link>
        <Link href="/tienda" className="btn btn-outline">
          Explorar tienda
        </Link>
      </div>
    </div>
  );
}
