
-- Update product mapping with correct EU API codes
UPDATE public.product_mapping 
SET eu_product_code = 'ORGFOUR', eu_product_name = 'Feed barley'
WHERE romanian_symbol = 'BARLEY';

UPDATE public.product_mapping 
SET eu_product_code = 'MAI', eu_product_name = 'Feed maize'
WHERE romanian_symbol = 'CORN';

UPDATE public.product_mapping 
SET eu_product_code = 'BLTPAN', eu_product_name = 'Milling wheat'
WHERE romanian_symbol = 'WHEAT';

UPDATE public.product_mapping 
SET eu_product_code = 'BLTFOUR', eu_product_name = 'Feed wheat'
WHERE romanian_symbol = 'DUR_WHEAT';

UPDATE public.product_mapping 
SET eu_product_code = 'AVO', eu_product_name = 'Feed oats'
WHERE romanian_symbol = 'OATS';

UPDATE public.product_mapping 
SET eu_product_code = 'ORGBRAS', eu_product_name = 'Malting barley'
WHERE romanian_symbol = 'RAPE';

-- Add missing products for complete coverage
INSERT INTO public.product_mapping (romanian_name, romanian_symbol, eu_product_code, eu_product_name) VALUES
('Orz furajere', 'FEED_BARLEY', 'ORGFOUR', 'Feed barley'),
('Porumb furajere', 'FEED_MAIZE', 'MAI', 'Feed maize'),
('Grâu panificație', 'MILLING_WHEAT', 'BLTPAN', 'Milling wheat'),
('Grâu furajere', 'FEED_WHEAT', 'BLTFOUR', 'Feed wheat'),
('Ovăz furajere', 'FEED_OATS', 'AVO', 'Feed oats'),
('Orz pentru malț', 'MALTING_BARLEY', 'ORGBRAS', 'Malting barley')
ON CONFLICT DO NOTHING;
