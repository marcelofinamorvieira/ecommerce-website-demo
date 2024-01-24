'use client';

import {
  BrandRecord,
  CollectionRecord,
  GeneralInterfaceRecord,
  MaterialRecord,
} from '@/graphql/generated';
import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type PropTypes = {
  collections: CollectionRecord[];
  brands: BrandRecord[];
  materials: MaterialRecord[];
  paramaterCollections: String[];
  parameterBrands: String[];
  parameterMaterials: String[];
  generalInterface: GeneralInterfaceRecord;
};

const SideFilter = ({
  collections,
  brands,
  materials,
  paramaterCollections,
  parameterBrands,
  parameterMaterials,
  generalInterface,
}: PropTypes) => {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const paramaterCollectionsFiltered = paramaterCollections.filter(
    (parameter) => parameter !== ''
  );
  const parameterBrandsFiltered = parameterBrands.filter(
    (parameter) => parameter !== ''
  );
  const parameterMaterialsFiltered = parameterMaterials.filter(
    (parameter) => parameter !== ''
  );

  const filters = [
    {
      id: 'collections',
      name: generalInterface.collection,
      options: collections.map((collection) => {
        return { id: collection.id, name: collection.name, checked: true };
      }),
    },
    {
      id: 'materials',
      name: generalInterface.material,
      options: materials.map((material) => {
        return { id: material.id, name: material.name, checked: true };
      }),
    },
    {
      id: 'brands',
      name: generalInterface.brand,
      options: brands.map((brands) => {
        return { id: brands.id, name: brands.name, checked: true };
      }),
    },
  ];

  const sortOptions = [
    { label: generalInterface.newArrivals, value: '_publishedAt_DESC' },
    { label: generalInterface.mostPopular, value: 'numberOfReviews_DESC' },
    { label: generalInterface.topRated, value: 'reviewAverage_DESC' },
    { label: generalInterface.price, value: 'price_DESC' },
    { label: generalInterface.sales, value: 'sale_DESC' },
  ];

  function exportQueryParameters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push('?' + params.toString());
  }

  return (
    <form className="mx-4 mb-8 text-center lg:mx-0 lg:mb-0 lg:text-left">
      <ul
        role="list"
        className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
      >
        {sortOptions.map((sortOption) => {
          const isSelected =
            searchParams.get('orderBy') === sortOption.value ||
            (!searchParams.get('orderBy') &&
              sortOption.value === '_publishedAt_DESC');
          return (
            <li key={sortOption.label}>
              <div
                className={`cursor-pointer ${isSelected ? 'font-bold' : ''}`}
                onClick={() => {
                  exportQueryParameters('orderBy', sortOption.value);
                }}
              >
                {sortOption.label}
              </div>
            </li>
          );
        })}
      </ul>

      {filters.map((section) => (
        <Disclosure
          defaultOpen={false}
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          {({ open, close }) => {
            return (
              <>
                <h3 className="-my-3 flow-root">
                  <Disclosure.Button className="flex w-full items-center justify-center bg-white py-3 text-sm text-gray-400 hover:text-gray-500 lg:justify-between">
                    <span className="font-medium text-gray-900">
                      {section.name}
                    </span>
                    <span className="ml-6 hidden items-center lg:flex">
                      {open ? (
                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel className="pt-6">
                  <div className="grid grid-cols-2 items-center justify-between gap-4 md:grid-cols-3 lg:block lg:space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <div
                        key={option.id}
                        className="flex items-center pl-6 md:pl-16 lg:pl-0"
                      >
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          type="checkbox"
                          checked={
                            paramaterCollectionsFiltered.includes(option.id) ||
                            parameterBrands.includes(option.id) ||
                            parameterMaterials.includes(option.id)
                          }
                          onChange={() => {
                            switch (section.id) {
                              case 'collections':
                                if (
                                  paramaterCollectionsFiltered.includes(
                                    option.id
                                  )
                                ) {
                                  exportQueryParameters(
                                    'collections',
                                    paramaterCollectionsFiltered
                                      .filter(
                                        (collection) => collection !== option.id
                                      )
                                      .join('|')
                                  );
                                  return;
                                }
                                paramaterCollectionsFiltered.push(option.id);
                                exportQueryParameters(
                                  'collections',
                                  paramaterCollectionsFiltered.join('|')
                                );
                                return;
                              case 'brands':
                                if (
                                  parameterBrandsFiltered.includes(option.id)
                                ) {
                                  exportQueryParameters(
                                    'brands',
                                    parameterBrandsFiltered
                                      .filter(
                                        (collection) => collection !== option.id
                                      )
                                      .join('|')
                                  );
                                  return;
                                }
                                parameterBrandsFiltered.push(option.id);
                                exportQueryParameters(
                                  'brands',
                                  parameterBrandsFiltered.join('|')
                                );
                                return;
                              case 'materials':
                                if (
                                  parameterMaterialsFiltered.includes(option.id)
                                ) {
                                  exportQueryParameters(
                                    'materials',
                                    parameterMaterialsFiltered
                                      .filter(
                                        (material) => material !== option.id
                                      )
                                      .join('|')
                                  );
                                  return;
                                }
                                parameterMaterialsFiltered.push(option.id);
                                exportQueryParameters(
                                  'materials',
                                  parameterMaterialsFiltered.join('|')
                                );
                                return;
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/80"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            );
          }}
        </Disclosure>
      ))}
    </form>
  );
};

export default SideFilter;
