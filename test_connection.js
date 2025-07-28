import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmwbjfpdhrnvnaazecoe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd2JqZnBkaHJudm5hYXplY29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzYwNDEsImV4cCI6MjA2OTIxMjA0MX0.qqtt8WbNEoNsdU_wTkhoTG0OvRlHis9HZ5iAEIazGyU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('contractors').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful');
    console.log('📊 Current record count:', data);
    
    // Test a simple insert
    console.log('🔍 Testing insert operation...');
    const testRecord = {
      state: 'CA',
      license_no: 'TEST123',
      data_source: 'TEST',
      business_name: 'Test Company'
    };
    
    const { error: insertError } = await supabase.from('contractors').upsert([testRecord], {
      onConflict: 'state,license_no',
      ignoreDuplicates: false,
    });
    
    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      return false;
    }
    
    console.log('✅ Insert test successful');
    
    // Clean up test record
    await supabase.from('contractors').delete().eq('license_no', 'TEST123');
    console.log('🧹 Test record cleaned up');
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});