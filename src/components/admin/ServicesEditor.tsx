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
    <div className="space-y-8">
      {/* Add New Service */}
      <div className="bg-white p-4 sm:p-6 rounded shadow-md">
        <h3 className="text-lg font-bold mb-3">Add New Service</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            className="border p-2 rounded w-full"
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
            className="border p-2 rounded w-full"
            value={newService.name ?? ''}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded w-full"
            value={newService.price ?? ''}
            onChange={(e) =>
              setNewService({ ...newService, price: parseFloat(e.target.value) })
            }
          />

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!newService.price_modifier}
              onChange={(e) =>
                setNewService({
                  ...newService,
                  price_modifier: e.target.checked,
                })
              }
            />
            Add `+` after price
          </label>
        </div>

        <textarea
          placeholder="Description"
          className="mt-3 border p-2 rounded w-full"
          value={newService.description ?? ''}
          onChange={(e) =>
            setNewService({ ...newService, description: e.target.value })
          }
        ></textarea>

        <button
          onClick={handleAddService}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 w-full sm:w-auto"
        >
          Add Service
        </button>
      </div>

      {/* Service List */}
      <div className="max-h-[600px] overflow-y-auto pr-1 space-y-6 border rounded bg-white p-4 sm:p-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <Throbber />
          </div>
        ) : (
          servicesByCategory.map((cat) => (
            <div key={cat.id}>
              <h4 className="text-lg font-bold text-red-600 mb-2">{cat.name}</h4>
              {cat.services.length === 0 ? (
                <p className="text-gray-500 text-sm">No services</p>
              ) : (
                <div className="space-y-4">
                  {cat.services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white p-2 sm:p-4 border rounded-md shadow-sm space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center gap-2"
                    >
                      <input
                        type="text"
                        className="border p-2 rounded w-full sm:w-[180px] text-gray-800"
                        value={service.name}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s) =>
                              s.id === service.id ? { ...s, name: e.target.value } : s
                            )
                          )
                        }
                      />

                      <input
                        type="text"
                        className="border p-2 rounded w-full sm:flex-1"
                        value={service.description ?? ''}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s) =>
                              s.id === service.id ? { ...s, description: e.target.value } : s
                            )
                          )
                        }
                      />

                      <input
                        type="number"
                        className="border p-2 rounded w-full sm:w-[100px]"
                        value={service.price}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s) =>
                              s.id === service.id ? { ...s, price: parseFloat(e.target.value) } : s
                            )
                          )
                        }
                      />

                      <label className="flex items-center gap-1 text-sm text-gray-700 sm:w-[80px]">
                        <input
                          type="checkbox"
                          checked={!!service.price_modifier}
                          onChange={(e) =>
                            setServices((prev) =>
                              prev.map((s) =>
                                s.id === service.id ? { ...s, price_modifier: e.target.checked } : s
                              )
                            )
                          }
                        />
                        Add `+` after price
                      </label>

                      <div className="flex gap-2 sm:ml-auto">
                        <button
                          onClick={() => handleUpdateService(service)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 text-sm"
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
