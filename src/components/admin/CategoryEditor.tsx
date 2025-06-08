'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { SALON_ID } from '@/lib/constants';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react'; // or your preferred icon

interface Category {
  id: number;
  name: string;
  sort_order: number;
}

function SortableItem({
  category,
  onChange,
  onSave,
  onDelete,
}: {
  category: Category;
  onChange: (id: number, name: string) => void;
  onSave: (category: Category) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border-b py-2 gap-2"
    >
      <div className="flex items-center gap-2 w-full">
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400">
          <GripVertical size={20} />
        </div>
        <input
          value={category.name}
          onChange={(e) => onChange(category.id, e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(category)}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
        >
          Save
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function CategoryEditor() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('salon_id', SALON_ID)
      .order('sort_order');

    if (error) {
      toast.error('Failed to load categories');
      return;
    }

    setCategories(data || []);
  }

  async function handleAddCategory() {
    const trimmed = newCategory.trim();
    if (!trimmed) return toast.error('Category name cannot be empty.');

    const nextSort = categories.length + 1;

    const res = await fetch('/api/admin/categories/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: trimmed,
        sort_order: nextSort,
        salon_id: SALON_ID,
      }),
    });

    if (!res.ok) {
      toast.error('Failed to add category.');
      return;
    }

    toast.success('Category added!');
    setNewCategory('');
    fetchCategories();
  }

  async function handleSaveCategory(category: Category) {
    const res = await fetch('/api/admin/categories/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: category.id,
        name: category.name,
      }),
    });

    if (!res.ok) {
      toast.error('Update failed.');
      return;
    }

    toast.success('Category updated.');
    fetchCategories();
  }

  async function handleDeleteCategory(id: number) {
    if (!window.confirm('Are you sure?')) return;

    const res = await fetch('/api/admin/categories/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      toast.error('Delete failed.');
      return;
    }

    toast.success('Category deleted.');
    fetchCategories();
  }

  function handleChange(id: number, name: string) {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, name } : cat
      )
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);

    const reordered = arrayMove(categories, oldIndex, newIndex).map((cat, index) => ({
      id: cat.id,
      sort_order: index + 1,
    }));

    try {
      const res = await fetch('/api/admin/categories/sort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reordered),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.success('Order updated!');
      fetchCategories();
    } catch (err) {
      console.error('Failed to update sort order:', err);
      toast.error('Failed to update order.');
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h3 className="text-lg font-bold mb-4">Edit Service Categories</h3>
      <div className="flex gap-4 mb-6">
        <input
          className="border p-2 rounded w-full"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Add
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {categories.map((cat) => (
              <SortableItem
                key={cat.id}
                category={cat}
                onChange={handleChange}
                onSave={handleSaveCategory}
                onDelete={handleDeleteCategory}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
