-- Case patient + planning fields (domain model alignment)
alter table public.cases
  add column if not exists patient_initials text,
  add column if not exists patient_external_id text,
  add column if not exists patient_age smallint check (patient_age is null or patient_age between 0 and 130),
  add column if not exists patient_sex text check (patient_sex is null or patient_sex in ('M', 'F')),
  add column if not exists patient_weight_kg numeric(5,2) check (patient_weight_kg is null or patient_weight_kg > 0),
  add column if not exists procedure_date date,
  add column if not exists operating_physician text,
  add column if not exists planning_physician_id uuid references public.profiles(id);

comment on column public.cases.patient_initials is 'De-identified patient initials (optional PHI-minimized field)';
comment on column public.cases.patient_external_id is 'Optional internal MRN / tracking ID';
comment on column public.cases.procedure_date is 'Scheduled procedure date';
comment on column public.cases.operating_physician is 'Operating physician display name until profile linkage exists';

create index if not exists idx_cases_procedure_date on public.cases(procedure_date);
