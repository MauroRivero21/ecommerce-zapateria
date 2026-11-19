import { MedusaContainer } from "@medusajs/framework";
import { DEFAULT_REGION_STORE_POLICIES } from "../lib/region-store-policies";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Initial store setup for Daniel Restrepo.
 *
 * The catalogue itself lives in `src/scripts/seed-demo-products.ts` so this
 * migration only creates the infrastructure the store needs: sales channel,
 * publishable key, COP region, taxes, warehouse, shipping options, categories
 * and the size/colour options shared by every shoe.
 */
export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countryCode = "co";
  const currencyCode = "cop";

  logger.info("Seeding store data...");
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Daniel Restrepo Online",
          description: "Canal de ventas principal",
        },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Daniel Restrepo Storefront",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  const {
    result: [store],
  } = await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Daniel Restrepo",
          supported_currencies: [
            {
              currency_code: currencyCode,
              is_default: true,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Colombia",
          currency_code: currencyCode,
          countries: [countryCode],
          payment_providers: ["pp_system_default"],
          metadata: DEFAULT_REGION_STORE_POLICIES,
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: [
      {
        country_code: countryCode,
        provider_id: "tp_system",
      },
    ],
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Bodega Bogotá",
          address: {
            city: "Bogotá",
            country_code: "CO",
            address_1: "Calle 100 # 15-20",
            postal_code: "110111",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  // This is created by a migration script in core.
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Envíos Colombia",
    type: "shipping",
    service_zones: [
      {
        name: "Colombia",
        geo_zones: [
          {
            country_code: countryCode,
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Envío estándar",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Estándar",
          description: "Entrega en 2 a 4 días hábiles.",
          code: "standard",
        },
        prices: [
          {
            currency_code: currencyCode,
            amount: 15000,
          },
          {
            region_id: region.id,
            amount: 15000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Envío express",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Entrega en 24 horas en ciudades principales.",
          code: "express",
        },
        prices: [
          {
            currency_code: currencyCode,
            amount: 25000,
          },
          {
            region_id: region.id,
            amount: 25000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding product categories and options...");

  await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        {
          name: "Running",
          is_active: true,
        },
        {
          name: "Lifestyle",
          is_active: true,
        },
        {
          name: "Training",
          is_active: true,
        },
      ],
    },
  });

  await createProductOptionsWorkflow(container).run({
    input: {
      product_options: [
        {
          title: "Talla",
          values: Array.from({ length: 11 }, (_, index) => String(35 + index)),
        },
        {
          title: "Color",
          values: [
            "Amarillo/Volt",
            "Blanco",
            "Blanco/Naranja",
            "Blanco/Negro",
            "Camel",
            "Gris",
            "Multicolor",
            "Negro",
            "Negro/Blanco",
            "Oliva",
            "Rojo",
            "Rojo/Negro",
            "Vino",
          ],
        },
      ],
    },
  });

  logger.info("Finished seeding store data.");
  logger.info(
    `Store "${store.name}" ready with region "${region.name}" (${currencyCode.toUpperCase()}).`
  );
}
