insert into users (id, full_name, email, role)
values
  ('11111111-1111-1111-1111-111111111111', 'Hashi', 'hashi@beirut.local', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Sadio', 'sadio@beirut.local', 'data_entry')
on conflict (email) do update set full_name = excluded.full_name, role = excluded.role;

insert into items (name, selling_price, unit_cost, seller_commission, created_by, updated_by)
values
  ('Wrap', 450.00, 180.00, 45.00, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('Samosa', 80.00, 30.00, 8.00, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('Tea', 120.00, 45.00, 10.00, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('Coffee', 150.00, 55.00, 12.00, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111')
on conflict (name) do update
set selling_price = excluded.selling_price,
    unit_cost = excluded.unit_cost,
    seller_commission = excluded.seller_commission,
    updated_by = excluded.updated_by;
