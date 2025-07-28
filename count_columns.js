// Count columns in the INSERT statement
const columns = [
  'state', 'license_no', 'data_source', 'last_update', 'business_name', 'bus_name_2', 'full_business_name',
  'mailing_address', 'city', 'county', 'zip_code', 'country', 'business_phone', 'business_type',
  'issue_date', 'reissue_date', 'expiration_date', 'inactivation_date', 'reactivation_date',
  'pending_suspension', 'pending_class_removal', 'pending_class_replace', 'primary_status', 'secondary_status',
  'raw_classifications', 'classification_codes', 'classification_descriptions', 'primary_classification', 'trade',
  'asbestos_reg', 'workers_comp_coverage_type', 'wc_insurance_company', 'wc_policy_number',
  'wc_effective_date', 'wc_expiration_date', 'wc_cancellation_date', 'wc_suspend_date',
  'cb_surety_company', 'cb_number', 'cb_effective_date', 'cb_cancellation_date', 'cb_amount',
  'wb_surety_company', 'wb_number', 'wb_effective_date', 'wb_cancellation_date', 'wb_amount',
  'db_surety_company', 'db_number', 'db_effective_date', 'db_cancellation_date', 'db_amount',
  'date_required', 'discp_case_region', 'db_bond_reason', 'db_case_no', 'name_tp_2'
];

console.log('📊 Column count in INSERT:', columns.length);
console.log('📋 Columns:');
columns.forEach((col, i) => {
  console.log(`  ${i + 1}. ${col}`);
});

console.log('\n🔍 Database expects 57 columns (excluding id, created_at, updated_at)');
console.log(`📊 We're providing: ${columns.length} columns`);
console.log(`🔧 Difference: ${57 - columns.length} columns`);

// Expected database columns (excluding id, created_at, updated_at)
const dbColumns = [
  'state', 'license_no', 'data_source', 'last_update', 'business_name', 'bus_name_2', 'full_business_name',
  'mailing_address', 'city', 'county', 'zip_code', 'country', 'business_phone', 'business_type',
  'issue_date', 'reissue_date', 'expiration_date', 'inactivation_date', 'reactivation_date',
  'pending_suspension', 'pending_class_removal', 'pending_class_replace', 'primary_status', 'secondary_status',
  'raw_classifications', 'classification_codes', 'classification_descriptions', 'primary_classification', 'trade',
  'asbestos_reg', 'workers_comp_coverage_type', 'wc_insurance_company', 'wc_policy_number',
  'wc_effective_date', 'wc_expiration_date', 'wc_cancellation_date', 'wc_suspend_date',
  'cb_surety_company', 'cb_number', 'cb_effective_date', 'cb_cancellation_date', 'cb_amount',
  'wb_surety_company', 'wb_number', 'wb_effective_date', 'wb_cancellation_date', 'wb_amount',
  'db_surety_company', 'db_number', 'db_effective_date', 'db_cancellation_date', 'db_amount',
  'date_required', 'discp_case_region', 'db_bond_reason', 'db_case_no', 'name_tp_2'
];

console.log(`\n📊 Expected DB columns: ${dbColumns.length}`);

if (columns.length === dbColumns.length) {
  console.log('✅ Column counts match!');
} else {
  console.log('❌ Column count mismatch');
}