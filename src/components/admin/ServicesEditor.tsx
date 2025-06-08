'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { SALON_ID } from '@/lib/constants';
import Throbber from '../Throbber';

interface Category {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  price_modifier?: boolean;
  sort_order?: number;
}

export default function ServicesEditor() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Partial<Service>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicesAndCategories();
  }, []);

  async function fetchServicesAndCategories() {
    setLoading(true);
    const { data: catData } = await supabase
      .from('categories')
      .select('*')
      .eq('salon_id', SALON_ID)
      .order('sort_order');

    const { data: svcData } = await supabase
      .from('services')
      .select('*')
      .eq('salon_id', SALON_ID)
      .order('category_id');
    if (catData) setCategories(catData);
    if (svcData) setServices(svcData);
    setLoading(false);
  }

  async function handleAddService() {
    if (!newService.name || !newService.price || !newService.category_id) {
      toast.error('Please complete all required fields.');
      return;
    }

    const safeService = {
      name: newService.name,
      description: newService.description ?? null,
      price: newService.price,
      category_id: newService.category_id,
      price_modifier: newService.price_modifier ?? false,
      salon_id: SALON_ID,
    };

    console.log('Adding service:', safeService);

    const res = await fetch('/api/admin/services/add', {
      method: 'POST',
      body: JSON.stringify(safeService),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Add failed:', err);
      toast.error('Failed to add service.');
      return;
    }

    toast.success('Service added!');
    setNewService({});
    fetchServicesAndCategories();
  }


  async function handleUpdateService(updated: Service) {
    const res = await fetch('/api/admin/services/update', {
      method: 'POST',
      body: JSON.stringify(updated),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Update failed:', errorText);
      toast.error('Failed to update service.');
      return;
    }

    toast.success('Service updated!');
    fetchServicesAndCategories();
  }

  async function handleDeleteService(id: number) {
    const res = await fetch('/api/admin/services/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Delete failed:', errorText);
      toast.error('Failed to delete service.');
      return;
    }

    toast.success('Service deleted.');
    fetchServicesAndCategories();
  }

  const servicesByCategory = categories.map((cat) => ({
    ...cat,
    services: services.filter((s) => s.category_id === cat.id),
  }));

  return (
    <div className="space-y-12">
      {/* Add New Service */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-bold mb-4">Add New Service</h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <select
            className="border p-2 rounded w-full md:w-1/3"
            value={newService.category_id ?? ''}
            onChange={(e) =>
              setNewService({ ...newService, category_id: Number(e.target.value) })
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Service Name"
            className="border p-2 rounded w-full md:w-1/3"
            value={newService.name ?? ''}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded w-full md:w-1/3"
            value={newService.price ?? ''}
            onChange={(e) =>
              setNewService({ ...newService, price: parseFloat(e.target.value) })
            }
          />
          <div className="flex items-start justify-end">
            <label htmlFor="price-modifier" className="text-sm font-medium text-gray-700 mb-1">
              Add `+` after price
            </label>
            <input
              id="price-modifier"
              type="checkbox"
              checked={!!newService.price_modifier}
              onChange={(e) =>
                setNewService({
                  ...newService,
                  price_modifier: e.target.checked,
                })
              }
            />
          </div>
        </div>

        <textarea
          placeholder="Description"
          className="mt-4 border p-2 rounded w-full"
          value={newService.description ?? ''}
          onChange={(e) =>
            setNewService({ ...newService, description: e.target.value })
          }
        ></textarea>

        <button
          onClick={handleAddService}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Add Service
        </button>
      </div>

      {/* Service List */}
      {/* Scrollable Service List */}
      <div className="max-h-[600px] overflow-y-auto pr-2 space-y-8 border rounded bg-white p-4">

        {loading ? (
          <div className='flex justify-center items-center'>
            <Throbber />
          </div>
        ) : (
          servicesByCategory.map((cat) => (
            <div key={cat.id}>
              <h4 className="text-xl font-bold text-red-600 mb-2">{cat.name}</h4>
              {cat.services.length === 0 ? (
                <p className="text-gray-500 text-sm">No services</p>
              ) : (
                <div className="space-y-4">
                  {cat.services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white p-4 border rounded-md shadow-sm flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <input
                        type="text"
                        className="border p-2 rounded w-full md:w-1/3"
                        value={service.name}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s) =>
                              s.id === service.id
                                ? { ...s, name: e.target.value }
                                : s
                            )
                          )
                        }
                      />
                      <input
                        type="text"
                        className="border p-2 rounded w-full md:w-1/3"
                        value={service.description ?? ''}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s) =>
                              s.id === service.id
                                ? { ...s, description: e.target.value }
                                : s
                            )
                          )
                        }
                      />
                      <input
                        type="number"
                        className="border p-2 rounded w-full md:w-1/6"
                        value={service.price}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s) =>
                              s.id === service.id
                                ? { ...s, price: parseFloat(e.target.value) }
                                : s
                            )
                          )
                        }
                      />
                      <div className="flex flex-col items-start md:w-1/6">
                        <label className="text-sm text-gray-700">Add +</label>
                        <input
                          type="checkbox"
                          checked={!!service.price_modifier}
                          onChange={(e) =>
                            setServices((prev) =>
                              prev.map((s) =>
                                s.id === service.id
                                  ? { ...s, price_modifier: e.target.checked }
                                  : s
                              )
                            )
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateService(service)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
