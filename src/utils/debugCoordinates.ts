
import { supabase } from '@/integrations/supabase/client';

export const debugFieldCoordinates = async (userId: string) => {
  console.log('=== DEBUG: Checking field coordinates ===');
  
  try {
    const { data: fields, error } = await supabase
      .from('fields')
      .select('id, name, coordinates_lat, coordinates_lng')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching fields for debug:', error);
      return;
    }

    console.log('Raw field data from database:');
    fields?.forEach(field => {
      console.log(`Field: ${field.name}`);
      console.log(`  ID: ${field.id}`);
      console.log(`  coordinates_lat: ${field.coordinates_lat} (type: ${typeof field.coordinates_lat})`);
      console.log(`  coordinates_lng: ${field.coordinates_lng} (type: ${typeof field.coordinates_lng})`);
      console.log(`  Valid coordinates: ${field.coordinates_lat !== null && field.coordinates_lng !== null}`);
      console.log('---');
    });

    const validFields = fields?.filter(f => f.coordinates_lat !== null && f.coordinates_lng !== null) || [];
    console.log(`Total fields: ${fields?.length || 0}`);
    console.log(`Fields with valid coordinates: ${validFields.length}`);

    return { total: fields?.length || 0, valid: validFields.length };
  } catch (error) {
    console.error('Error in debugFieldCoordinates:', error);
  }
};
