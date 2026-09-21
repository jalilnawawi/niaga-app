import type { FormEvent } from 'react';
import type { Category } from '@niaga/shared';

type Props = {
  categories: Category[];
  onCreate: (name: string) => Promise<boolean>;
  onRename: (id: string, name: string) => Promise<boolean>;
  onDelete: (id: string) => void;
};

const nameOf = (e: FormEvent<HTMLFormElement>) => String(new FormData(e.currentTarget).get('name'));

export function CategoryList({ categories, onCreate, onRename, onDelete }: Props) {
  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (await onCreate(nameOf(e))) form.reset();
  }

  return (
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading">Kategori</h2>
      <form onSubmit={create} aria-label="Tambah kategori">
        <label>
          Nama kategori <input name="name" required maxLength={50} autoComplete="off" />
        </label>
        <button type="submit">Tambah kategori</button>
      </form>
      {categories.length === 0 && <p>Belum ada kategori.</p>}
      <ul>
        {categories.map((c) => (
          // key includes the name so the input resets to the saved value after a rename.
          <li key={`${c.id}:${c.name}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onRename(c.id, nameOf(e));
              }}
            >
              <input name="name" aria-label={`Nama kategori ${c.name}`} defaultValue={c.name} required maxLength={50} autoComplete="off" />
              <button type="submit">Simpan</button>
              <button type="button" onClick={() => onDelete(c.id)} aria-label={`Hapus ${c.name}`}>
                Hapus
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
