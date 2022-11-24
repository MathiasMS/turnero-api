CREATE extension "uuid-ossp";

CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    salt TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    fraction NUMERIC NOT NULL,
    quota NUMERIC NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.procedures (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category_id UUID NOT NULL references categories(id),
    description TEXT,
    from_date TIMESTAMPTZ,
    to_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.procedures_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    procedure_id UUID NOT NULL references procedures(id),
    is_taken BOOL DEFAULT FALSE,
    appointment_number TEXT DEFAULT NULL,
    email TEXT DEFAULT NULL,
    date DATE,
    hour TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
