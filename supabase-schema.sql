-- Supabase tablo şeması
create table if not exists users (
	id bigserial primary key,
	email text unique not null,
	password_hash text,
	name text not null,
	role text default 'user',
	last_login timestamptz,
	created_at timestamptz default now()
);

create table if not exists products (
	id bigserial primary key,
	name text not null,
	description text,
	price numeric(10,2) not null,
	image text,
	category text,
	ingredients text,
	available boolean default true,
	created_at timestamptz default now()
);

create table if not exists orders (
	id bigserial primary key,
	user_id bigint not null references users(id),
	total_amount numeric(10,2) not null,
	status int default 0,
	created_at timestamptz default now()
);

create table if not exists order_items (
	id bigserial primary key,
	order_id bigint not null references orders(id) on delete cascade,
	product_id bigint not null references products(id),
	quantity int not null,
	price numeric(10,2) not null,
	created_at timestamptz default now()
); 