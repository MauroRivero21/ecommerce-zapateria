# Daniel Restrepo · E-commerce de sneakers

Storefront de e-commerce inspirado en la experiencia de Adidas: home editorial, catálogo con filtros, detalle de producto con tallas, carrito persistente, checkout y pasarela Wompi. El proyecto está pensado para Colombia (COP, PSE, Nequi, Bancolombia, contra entrega).

## Estado actual

| Módulo | Estado |
|---|---|
| Storefront Next.js 15 + Tailwind 4 | ✅ Funcional |
| Catálogo demo (14 productos, tallas, colores, stock) | ✅ Funcional |
| Carrito + drawer + persistencia local | ✅ Funcional |
| Checkout con validación y cálculo server-side | ✅ Funcional |
| Wompi Web Checkout + firma de integridad | ✅ Listo para llaves reales |
| Webhook Wompi con validación de checksum | ✅ Base implementada |
| Backend Medusa v2 + admin | ✅ Migrado y funcionando |
| Catálogo Medusa (14 productos, 192 variantes, stock) | ✅ Sembrado en PostgreSQL |
| Órdenes persistidas en base de datos | ⏳ Siguiente fase (conectar checkout a Medusa) |
| Cuentas de cliente, emails, facturación DIAN | ⏳ Siguiente fase |

> **Modo demo:** sin las variables de Wompi, el checkout crea un pedido de prueba y muestra una pantalla de confirmación. No se cobra nada. Es ideal para revisar el flujo completo.

## Estructura

```
.
├── storefront/                 # Next.js 15 (App Router), Tailwind 4, TypeScript
│   ├── src/app/                # Home, tienda, producto, carrito, checkout, ayuda, legal
│   ├── src/components/         # Header, footer, carrito, cards, checkout, etc.
│   ├── src/lib/                # Catálogo, tipos, precios, envíos, configuración
│   └── public/products/        # Imágenes demo (reemplazar por fotografía propia)
├── backend/                    # Medusa v2 (monorepo DTC starter)
│   └── apps/backend/           # API + admin de Medusa
│       ├── static/products/    # Imágenes servidas por Medusa para el catálogo
│       └── src/scripts/        # Seed del catálogo de zapatillas
└── README.md
```

## 1. Levantar el storefront

Requisitos: Node.js 20+ y npm.

```bash
cd storefront
npm install
npm run dev
```

Abre `http://localhost:3000`.

Comandos útiles:

```bash
npm run build   # build de producción
npm run lint    # ESLint
npx tsc --noEmit
```

## 2. Configurar Wompi (pagos reales)

1. Crea una cuenta de comercio en [Wompi](https://comercios.wompi.co).
2. Copia `.env.example` a `.env.local` en `storefront/`.
3. Completa:

```env
NEXT_PUBLIC_SITE_URL=https://tudominio.com
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_...
WOMPI_INTEGRITY_SECRET=prod_integrity_...
WOMPI_EVENTS_SECRET=prod_events_...
```

4. En la consola de Wompi configura la URL de eventos:

```
https://tudominio.com/api/wompi/webhook
```

5. Activa los métodos de pago que quieras ofrecer (tarjetas, PSE, Nequi, Bancolombia).

### Cómo funciona el flujo

- El cliente arma el carrito en el navegador.
- `POST /api/checkout` **recalcula precios y stock en el servidor** (nunca confía en el total del cliente).
- Si hay llaves de Wompi, el servidor genera la firma `SHA256(reference + amount_in_cents + COP + integrity_secret)` y devuelve la URL de Web Checkout.
- Wompi redirige a `/checkout/exito?pedido=...`.
- El webhook valida el checksum con `WOMPI_EVENTS_SECRET` y recibe `transaction.updated`.

> **Importante:** hoy el webhook solo registra el pago aprobado. Antes de producción debes persistir la orden (Medusa/Postgres) y marcarla como pagada allí. Nunca confíes en el monto que llega desde el navegador.

## 3. Backend Medusa

El backend se creó con el DTC starter de Medusa v2. Requiere **Node.js 22.23+** y PostgreSQL. Ya está migrado, sembrado y con usuario administrador.

```bash
# PostgreSQL local en Docker (puerto 5433 para no chocar con un Postgres local)
docker run -d --name dr-postgres \
  -e POSTGRES_USER=medusa \
  -e POSTGRES_PASSWORD=medusa \
  -e POSTGRES_DB=medusa \
  -p 5433:5432 postgres:16-alpine

cd backend/apps/backend
# .env ya apunta a postgres://medusa:medusa@localhost:5433/medusa
npx medusa db:migrate
npm run seed          # 14 zapatillas, 192 variantes, precios COP y stock
npm run dev
```

Si necesitas recrear el usuario administrador:

```bash
npx medusa user -e admin@danielrestrepo.co -p "TU-CLAVE-SEGURA"
```

- API: `http://localhost:9000`
- Admin: `http://localhost:9000/app`
- Credenciales locales de demo: `admin@danielrestrepo.co` / `DR-Admin-2026!`
  (cámbialas antes de desplegar; no las uses en producción)
- Región: Colombia (COP), IVA y envíos estándar/express configurados en Medusa.
- Documentación del starter: `backend/README.md`

El catálogo del storefront actual vive en `storefront/src/lib/products.ts` para que el diseño sea fácil de iterar. El backend ya tiene el mismo catálogo sembrado en Medusa (14 productos, tallas, colores, stock e imágenes en `backend/apps/backend/static/products/`). La siguiente fase es consumir la Store API (`/store/products`) con la publishable key y persistir las órdenes del checkout en Medusa.


## 4. Personalizar

- **Marca, contacto, envío gratis:** `storefront/src/lib/config.ts`.
- **Productos, precios, tallas, stock, imágenes:** `storefront/src/lib/products.ts`.
- **Colores y tipografía:** `storefront/src/app/globals.css` (tokens `ink`, `paper`, `volt`, etc.).
- **Textos legales:** `storefront/src/app/legal/[slug]/page.tsx` (revisar con abogado antes de publicar).
- **Imágenes:** están en `storefront/public/products/`. Son placeholders de Unsplash con marcas visibles; **reemplázalas por fotografía propia** antes de lanzar.

## 5. Checklist antes de producción

- [x] Backend Medusa migrado, catálogo sembrado y admin verificado.
- [ ] Reemplazar imágenes demo por fotos propias (sin logos de terceros).
- [ ] Configurar llaves de Wompi de producción y probar en sandbox.
- [ ] Conectar el storefront a la Store API de Medusa y persistir órdenes allí.
- [ ] Validar el pago en el webhook y marcarlo como pagado en Medusa.
- [ ] Configurar correo transaccional (Resend/Postmark) y facturación electrónica DIAN.
- [ ] Integrar transportadora (Coordinadora, Interrapidísimo o Envía) y tarifas por ciudad.
- [ ] Revisar términos, privacidad y autorización de datos (Ley 1581) con abogado.
- [ ] Configurar dominio, HTTPS, `NEXT_PUBLIC_SITE_URL` y `metadataBase`.
- [ ] Añadir analítica (GA4, Meta Pixel/CAPI) y monitoreo de errores (Sentry).
- [ ] Probar en móvil, accesibilidad y Core Web Vitals.
- [ ] Cambiar la contraseña del admin y los secretos JWT/COOKIE de Medusa.

## Notas técnicas

- El carrito usa `localStorage`; no hay cuentas de usuario todavía.
- El checkout no guarda PII en el servidor en modo demo; el historial de pedidos vive en el navegador.
- Los precios se muestran en COP con IVA incluido.
- La UI está en español de Colombia y es mobile-first.
- No se almacenan datos de tarjeta: el flujo real delega en Wompi (PCI SAQ A).

