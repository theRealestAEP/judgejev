// Authored story setups share numerical rules. Each keeps its charge, subject, and responsibility evidence together.
export const courtCatalog = [
  {
    kind: 'crane_restart',
    family: 'rest',
    title: 'The crane restart',
    charge: 'restarting a crane before its required cooling interval ended',
    subject: 'the dock crane',
    unit: 'minutes',
    context:
      'The operator camera identifies you at the controls for the shutdown and restart. The charge concerns the cooling interval alone.',
  },
  {
    kind: 'tunnel_ventilation',
    family: 'rest',
    title: 'The tunnel re-entry',
    charge:
      'authorizing tunnel re-entry before the required ventilation interval ended',
    subject: 'the tunnel ventilation cycle',
    unit: 'minutes',
    context:
      'Your signed order sent the inspection crew back into the tunnel. The ventilation fan ran continuously during the recorded interval.',
  },
  {
    kind: 'freight_break',
    family: 'rest',
    title: 'The freight driver’s break',
    charge: 'resuming a freight journey before completing the required break',
    subject: 'the driver’s rest break',
    unit: 'minutes',
    context:
      'The cab camera identifies you driving on both sides of the break. During the break you were relieved of all work.',
  },
  {
    kind: 'resin_set',
    family: 'rest',
    title: 'The reopened walkway',
    charge:
      'reopening a treated walkway before the required setting interval ended',
    subject: 'the walkway setting period',
    unit: 'minutes',
    context:
      'You signed the reopening order. The specified compound and ambient conditions remained unchanged throughout the setting period.',
  },
  {
    kind: 'reservoir_draw',
    family: 'aggregate',
    title: 'The reservoir allocation',
    charge: 'drawing more water than the daily allocation',
    subject: 'the reservoir withdrawal',
    unit: 'litres',
    context:
      'The two meter runs cover all water you drew that day. You controlled the pump, and both meters passed calibration.',
  },
  {
    kind: 'quarry_load',
    family: 'aggregate',
    title: 'The quarry departure',
    charge: 'dispatching a vehicle above its payload allowance',
    subject: 'the stone payload',
    unit: 'kilograms',
    context:
      'You authorized departure after both loads were aboard. The vehicle carried only these loads, measured on checked scales.',
  },
  {
    kind: 'concert_capacity',
    family: 'aggregate',
    title: 'The occupied gallery',
    charge: 'admitting more visitors than the gallery occupancy limit',
    subject: 'the gallery audience',
    unit: 'people',
    context:
      'You controlled admissions. Synchronized counts cover both occupied rooms at the same instant, with nobody counted twice.',
  },
  {
    kind: 'overtime_total',
    family: 'aggregate',
    title: 'The overtime approval',
    charge: 'approving more overtime than the weekly allowance',
    subject: 'the weekly overtime',
    unit: 'hours',
    context:
      'Your signatures authorize both entries for the same worker and week. These are the only overtime entries for that week.',
  },
  {
    kind: 'deposit_refund',
    family: 'refund',
    title: 'The returned deposit',
    charge: 'refunding more than the customer’s remaining deposit',
    subject: 'the rental deposit',
    unit: 'dollars',
    context:
      'You issued the final refund to the original payer. The posted deductions were authorized, final, and the only adjustments.',
  },
  {
    kind: 'escrow_release',
    family: 'refund',
    title: 'The escrow release',
    charge: 'releasing more escrow than remained after the agreed deduction',
    subject: 'the construction escrow',
    unit: 'dollars',
    context:
      'Your authenticated instruction released the funds. The parties had agreed the stated deduction; the ledger lists every movement.',
  },
  {
    kind: 'travel_advance',
    family: 'refund',
    title: 'The advance repayment',
    charge: 'collecting more than the unused travel advance',
    subject: 'the travel advance',
    unit: 'dollars',
    context:
      'You collected the repayment from the employee. The approved expenses had already been accepted against this advance.',
  },
  {
    kind: 'grant_balance',
    family: 'refund',
    title: 'The grant recovery',
    charge: 'recovering more grant money than remained unspent',
    subject: 'the project grant',
    unit: 'dollars',
    context:
      'You ordered the recovery. All recorded project spending was eligible and had been accepted before the recovery was calculated.',
  },
  {
    kind: 'noise_measurement',
    family: 'uncertainty',
    title: 'The disputed noise reading',
    charge: 'exceeding the site’s sound-level limit',
    subject: 'the generator sound reading',
    unit: 'dB',
    context:
      'You operated the generator during the single measurement. The complaint relies entirely on this instrument reading.',
  },
  {
    kind: 'bridge_deflection',
    family: 'uncertainty',
    title: 'The bridge load test',
    charge: 'accepting a bridge test with deflection above the stated limit',
    subject: 'the beam deflection',
    unit: 'millimetres',
    context:
      'You signed the test acceptance. This reading is the sole evidence of excessive deflection; no damage or second measurement is recorded.',
  },
  {
    kind: 'boundary_survey',
    family: 'uncertainty',
    title: 'The boundary survey',
    charge: 'placing a fence beyond the permitted boundary offset',
    subject: 'the fence offset',
    unit: 'centimetres',
    context:
      'You installed the fence at the surveyed point. The charge relies on this survey; positive offsets mean movement beyond the reference line.',
  },
  {
    kind: 'stack_emission',
    family: 'uncertainty',
    title: 'The stack reading',
    charge: 'operating a stack above its emissions limit',
    subject: 'the stack concentration',
    unit: 'mg/m³',
    context:
      'You controlled the plant during this test. The allegation relies on this reading, with no independent sample or emission measurement.',
  },
  {
    kind: 'blended_fuel',
    family: 'weighted',
    title: 'The blended fuel',
    charge:
      'certifying a fuel blend whose contaminant percentage exceeded the limit',
    subject: 'the fuel blend',
    unit: 'percent',
    context:
      'You signed the blend certificate. The batches mixed completely without loss or reaction, and the reported concentrations are exact mass percentages.',
  },
  {
    kind: 'ore_grade',
    family: 'weighted',
    title: 'The ore certificate',
    charge:
      'certifying an ore mixture whose impurity percentage exceeded the limit',
    subject: 'the ore mixture',
    unit: 'percent',
    context:
      'You signed the impurity certificate. Checked scales and assays cover the complete, uniformly mixed consignment.',
  },
  {
    kind: 'recycled_content',
    family: 'weighted',
    title: 'The polymer batch',
    charge:
      'certifying a polymer mixture whose virgin-material percentage exceeded the limit',
    subject: 'the polymer mixture',
    unit: 'percent',
    context:
      'You signed the materials certificate. The batches mixed without loss; the reported percentages refer to virgin material by mass.',
  },
  {
    kind: 'salinity_blend',
    family: 'weighted',
    title: 'The irrigation blend',
    charge:
      'releasing irrigation water whose salt percentage exceeded the limit',
    subject: 'the irrigation blend',
    unit: 'percent',
    context:
      'You authorized release. The two weighed batches mixed completely; salt and water were neither added nor removed afterward.',
  },
  {
    kind: 'equipment_rebate',
    family: 'discount',
    title: 'The equipment rebate',
    charge: 'charging above the agreed price after two successive discounts',
    subject: 'the equipment purchase',
    unit: 'dollars',
    context:
      'You issued and collected the invoice. The signed agreement specifies successive discounts and includes all taxes and delivery charges.',
  },
  {
    kind: 'venue_discount',
    family: 'discount',
    title: 'The venue booking',
    charge: 'charging above the agreed price after two successive discounts',
    subject: 'the venue booking',
    unit: 'dollars',
    context:
      'You issued the settled booking invoice. Both discounts apply to this booking, and there are no separate service charges.',
  },
  {
    kind: 'software_renewal',
    family: 'discount',
    title: 'The renewal invoice',
    charge: 'charging above the agreed price after two successive discounts',
    subject: 'the software renewal',
    unit: 'dollars',
    context:
      'You approved the paid renewal invoice. The contract grants both discounts successively and includes every applicable fee.',
  },
  {
    kind: 'fleet_service',
    family: 'discount',
    title: 'The fleet service bill',
    charge: 'charging above the agreed price after two successive discounts',
    subject: 'the fleet service',
    unit: 'dollars',
    context:
      'You collected the service bill. The agreed work was completed with no additions; both discounts apply to its full price.',
  },
  {
    kind: 'storage_vessel',
    family: 'displacement',
    title: 'The filled vessel',
    charge: 'ordering a liquid fill above the vessel’s usable capacity',
    subject: 'the storage vessel',
    unit: 'litres',
    context:
      'You ordered the fill. The vessel began empty of liquid; its fixed insert remained fully submerged, and the liquid neither expanded nor leaked.',
  },
  {
    kind: 'ballast_tank',
    family: 'displacement',
    title: 'The ballast order',
    charge: 'ordering ballast water above the tank’s usable capacity',
    subject: 'the ballast tank',
    unit: 'litres',
    context:
      'Your signed order set the fill quantity. The empty tank contained a fixed, fully submerged block; all stated volumes use the same conditions.',
  },
  {
    kind: 'archive_chest',
    family: 'displacement',
    title: 'The sealed archive chest',
    charge:
      'certifying enough capacity for an archive load that exceeded the chest’s usable volume',
    subject: 'the archive chest',
    unit: 'litres',
    context:
      'You signed the packing certificate. The modular container system can use the remaining space without gaps; the fixed internal divider occupies the stated volume.',
  },
  {
    kind: 'cargo_volume',
    family: 'displacement',
    title: 'The cargo compartment',
    charge:
      'accepting cargo whose volume exceeded the compartment’s usable volume',
    subject: 'the cargo compartment',
    unit: 'cubic metres',
    context:
      'You accepted the loading plan. The fixed equipment occupies the stated volume; flexible bags can use all remaining space, subject to the volume requirement.',
  },
  {
    kind: 'sterile_packaging',
    family: 'output',
    title: 'The packaging count',
    charge:
      'certifying the required output without producing enough sealed packs',
    subject: 'the packaging run',
    unit: 'packs',
    context:
      'You signed the output certificate. Every completed cycle produced the stated number of conforming packs; rejected packs are already excluded.',
  },
  {
    kind: 'water_treatment',
    family: 'output',
    title: 'The treatment certificate',
    charge: 'certifying the required output without treating enough water',
    subject: 'the treatment run',
    unit: 'litres',
    context:
      'You signed the treatment certificate. Every completed cycle treated the stated amount; the feed meter and cycle counter passed inspection.',
  },
  {
    kind: 'ballot_printing',
    family: 'output',
    title: 'The ballot print run',
    charge:
      'certifying the required output without printing enough ballot sheets',
    subject: 'the ballot print run',
    unit: 'sheets',
    context:
      'You certified the print quantity. All recorded cycles completed; setup sheets and spoiled copies are excluded from the cycle output.',
  },
  {
    kind: 'data_export',
    family: 'output',
    title: 'The exported records',
    charge: 'certifying the required output without exporting enough records',
    subject: 'the data export',
    unit: 'records',
    context:
      'You signed the completion statement. Each completed batch contains the stated number of distinct records; the manifest lists all batches.',
  },
  {
    kind: 'shared_repairs',
    family: 'allocation',
    title: 'The shared roof bill',
    charge: 'billing a tenant more than its agreed share of the repair',
    subject: 'the shared roof repair',
    unit: 'dollars',
    context:
      'You collected the tenant’s bill. All costs were eligible, and the agreement allocates this entire cost using the stated shares.',
  },
  {
    kind: 'freight_split',
    family: 'allocation',
    title: 'The freight allocation',
    charge: 'billing a customer more than its agreed share of freight costs',
    subject: 'the shared freight booking',
    unit: 'dollars',
    context:
      'You issued the customer’s paid invoice. The total includes every freight charge, allocated solely by the agreed shares.',
  },
  {
    kind: 'insurance_pool',
    family: 'allocation',
    title: 'The pool contribution',
    charge: 'collecting more than a member’s agreed share of the pool expense',
    subject: 'the insurance pool expense',
    unit: 'dollars',
    context:
      'You collected the contribution. The members approved this expense and the share allocation; there are no prior balances or other fees.',
  },
  {
    kind: 'district_heating',
    family: 'allocation',
    title: 'The heating assessment',
    charge: 'charging a building more than its agreed share of heating costs',
    subject: 'the district heating bill',
    unit: 'dollars',
    context:
      'You authorized the building’s charge. The supplier total and allocation shares are final and cover the entire billing period.',
  },
  {
    kind: 'inspection_release',
    family: 'prerequisite',
    title: 'The released lift',
    charge: 'releasing a lift before its required inspection passed',
    subject: 'the lift release',
    unit: 'minutes',
    context:
      'Your authenticated release order opened the lift to passengers. The inspection register contains the only applicable inspection result.',
  },
  {
    kind: 'food_hold',
    family: 'prerequisite',
    title: 'The released consignment',
    charge:
      'releasing a held food consignment before its required clearance passed',
    subject: 'the consignment release',
    unit: 'minutes',
    context:
      'You signed the release order for this lot. Its identity remained sealed and unchanged from sampling through dispatch.',
  },
  {
    kind: 'rail_reopening',
    family: 'prerequisite',
    title: 'The reopened track',
    charge: 'reopening track before its required inspection passed',
    subject: 'the track reopening',
    unit: 'minutes',
    context:
      'Your signed order reopened the named section. The inspection and dispatch records identify the same section and working day.',
  },
  {
    kind: 'payment_clearance',
    family: 'prerequisite',
    title: 'The cleared payment',
    charge: 'releasing a payment before its required verification passed',
    subject: 'the payment release',
    unit: 'minutes',
    context:
      'Your individual signature released this payment. The verification and payment records share its unique transaction identifier.',
  },
  {
    kind: 'welding_approval',
    family: 'expiry',
    title: 'The welder’s approval',
    charge: 'performing controlled welding after your approval expired',
    subject: 'the welding operation',
    unit: 'minutes',
    context:
      'A supervisor identifies you performing the recorded weld. The approval covers this exact process and equipment, subject to its expiry.',
  },
  {
    kind: 'drone_clearance',
    family: 'expiry',
    title: 'The flight clearance',
    charge: 'launching a survey drone after its clearance expired',
    subject: 'the survey launch',
    unit: 'minutes',
    context:
      'Launch footage identifies you at the controls. The clearance covers this launch area and flight, subject to its stated expiry.',
  },
  {
    kind: 'demolition_permit',
    family: 'expiry',
    title: 'The demolition permit',
    charge: 'starting demolition after your permit expired',
    subject: 'the demolition start',
    unit: 'minutes',
    context:
      'Site footage identifies you starting the work. The permit covers this building and work type, subject to its expiry.',
  },
  {
    kind: 'export_license',
    family: 'expiry',
    title: 'The export license',
    charge: 'dispatching a shipment after its license expired',
    subject: 'the shipment dispatch',
    unit: 'minutes',
    context:
      'You signed the dispatch instruction. The license covers this shipment and destination, subject to its expiry.',
  },
  {
    kind: 'excavation_zone',
    family: 'scope',
    title: 'The excavation zone',
    charge: 'excavating in a zone outside your permit',
    subject: 'the excavation',
    unit: 'zone',
    context:
      'Survey footage identifies you directing the excavation. The map and permit share the same current zone numbering.',
  },
  {
    kind: 'fishing_sector',
    family: 'scope',
    title: 'The licensed sector',
    charge: 'operating nets in a sector outside your license',
    subject: 'the net deployment',
    unit: 'sector',
    context:
      'Patrol footage identifies you deploying the nets. The license and verified position plot use the same sector chart.',
  },
  {
    kind: 'archive_clearance',
    family: 'scope',
    title: 'The archive clearance',
    charge: 'opening an archive compartment outside your clearance',
    subject: 'the archive opening',
    unit: 'compartment',
    context:
      'The access camera identifies you opening the compartment. The current register is complete and uses the same compartment numbering.',
  },
  {
    kind: 'broadcast_channel',
    family: 'scope',
    title: 'The broadcast license',
    charge: 'transmitting on a channel outside your license',
    subject: 'the transmission',
    unit: 'channel',
    context:
      'The authenticated station log identifies you initiating the transmission. The receiver and license use the same channel plan.',
  },
  {
    kind: 'weighbridge_vehicle',
    family: 'identity',
    title: 'The weighed vehicle',
    charge: 'dispatching your vehicle despite its recorded failed weight check',
    subject: 'the vehicle',
    unit: 'vehicle',
    context:
      'The dispatch camera identifies you sending your assigned vehicle out. The assignment, inspection, and dispatch registers are complete.',
  },
  {
    kind: 'failed_valve',
    family: 'identity',
    title: 'The rejected valve',
    charge: 'installing your assigned valve despite its recorded failed test',
    subject: 'the valve',
    unit: 'valve',
    context:
      'The installation record and camera identify you fitting your assigned valve. Serial markings remained attached throughout the work.',
  },
  {
    kind: 'fire_door',
    family: 'identity',
    title: 'The fire-door report',
    charge:
      'accepting your assigned door despite its recorded failed inspection',
    subject: 'the fire door',
    unit: 'door',
    context:
      'You signed acceptance of your assigned door. Installation labels and inspection labels use the same permanent door identifiers.',
  },
  {
    kind: 'radio_test',
    family: 'identity',
    title: 'The failed radio',
    charge: 'issuing your assigned radio despite its recorded failed test',
    subject: 'the radio',
    unit: 'radio',
    context:
      'Your individual signature issued the assigned radio. Its permanent serial number remained readable, and the test register is complete.',
  },
  {
    kind: 'foreign_invoice',
    family: 'currency',
    title: 'The converted invoice',
    charge: 'collecting more local currency than a foreign invoice allowed',
    subject: 'the foreign invoice',
    unit: 'local dollars',
    context:
      'You collected the converted invoice. The contract fixes the stated exchange rate and permits no conversion fee or additional charge.',
  },
  {
    kind: 'currency_reimbursement',
    family: 'currency',
    title: 'The overseas expense',
    charge: 'collecting more local currency than an overseas expense allowed',
    subject: 'the overseas expense',
    unit: 'local dollars',
    context:
      'You claimed and received the reimbursement. The employer accepted the expense and requires this fixed exchange rate without fees.',
  },
  {
    kind: 'customs_conversion',
    family: 'currency',
    title: 'The customs valuation',
    charge: 'declaring a shipment below its required local-currency valuation',
    subject: 'the shipment valuation',
    unit: 'local dollars',
    context:
      'You signed the declaration. The rules require the complete invoice at the stated fixed rate, without deductions or other adjustments.',
  },
  {
    kind: 'royalty_exchange',
    family: 'currency',
    title: 'The royalty conversion',
    charge: 'collecting more local currency than a foreign royalty allowed',
    subject: 'the foreign royalty',
    unit: 'local dollars',
    context:
      'You collected the royalty payment. The agreement fixes the stated conversion rate and contains no additional fees.',
  },
  {
    kind: 'water_counter',
    family: 'rollover',
    title: 'The water meter rollover',
    charge: 'certifying a water-use figure below the metered use',
    subject: 'the water use',
    unit: 'litres',
    context:
      'You signed the use certificate. The meter measures whole litres; it ran forward throughout the interval and passed calibration.',
  },
  {
    kind: 'machine_counter',
    family: 'rollover',
    title: 'The cycle counter',
    charge: 'certifying a cycle count below the machine’s recorded output',
    subject: 'the machine output',
    unit: 'cycles',
    context:
      'You signed the output certificate. The counter advances once per completed cycle and was neither reset nor replaced.',
  },
  {
    kind: 'toll_counter',
    family: 'rollover',
    title: 'The toll record',
    charge: 'certifying fewer vehicle passages than the counter recorded',
    subject: 'the toll passages',
    unit: 'vehicles',
    context:
      'You signed the traffic return. Every forward counter step represents one vehicle; test activations and reverse movements were excluded.',
  },
  {
    kind: 'power_counter',
    family: 'rollover',
    title: 'The energy register',
    charge: 'certifying electricity use below the meter’s recorded use',
    subject: 'the electricity use',
    unit: 'kWh',
    context:
      'You signed the meter return. This register records whole kWh of imported energy only; it was neither reset nor replaced.',
  },
  {
    kind: 'quarry_blasts',
    family: 'window',
    title: 'The blast window',
    charge: 'authorizing too many blasts within the permit’s rolling interval',
    subject: 'the quarry blasts',
    unit: 'blasts',
    context:
      'Your signature authorizes each listed blast. All three occurred; the certified log contains every blast near the interval.',
  },
  {
    kind: 'alarm_resets',
    family: 'window',
    title: 'The alarm resets',
    charge:
      'performing too many alarm resets within the service rule’s rolling interval',
    subject: 'the alarm resets',
    unit: 'resets',
    context:
      'Your authenticated login performed every listed reset. The log is complete, and all listed actions count under the stated rule.',
  },
  {
    kind: 'river_flushes',
    family: 'window',
    title: 'The outfall flushes',
    charge:
      'ordering too many flushes within the discharge permit’s rolling interval',
    subject: 'the outfall flushes',
    unit: 'flushes',
    context:
      'Your orders initiated all listed flushes. Each was a separate completed release, and the recorder lists every nearby release.',
  },
  {
    kind: 'test_activations',
    family: 'window',
    title: 'The siren activations',
    charge:
      'ordering too many siren tests within the authorization’s rolling interval',
    subject: 'the siren tests',
    unit: 'tests',
    context:
      'Your individual control key initiated all listed tests. The recorder is complete; each event is a separate qualifying test.',
  },
  {
    kind: 'safety_records',
    family: 'retention',
    title: 'The destroyed safety file',
    charge: 'destroying a safety file before its retention period ended',
    subject: 'the safety file',
    unit: 'days',
    context:
      'You authorized destruction of the only retained copy. The recorded withdrawal date is final and applies to the entire file.',
  },
  {
    kind: 'contract_archive',
    family: 'retention',
    title: 'The removed contract file',
    charge: 'destroying a contract file before its retention period ended',
    subject: 'the contract file',
    unit: 'days',
    context:
      'Your signed order destroyed the only retained copy. The contract’s recorded closure is final, with no later amendment or claim.',
  },
  {
    kind: 'calibration_archive',
    family: 'retention',
    title: 'The calibration archive',
    charge:
      'destroying calibration records before their retention period ended',
    subject: 'the calibration records',
    unit: 'days',
    context:
      'You deleted the only retained records. The equipment’s withdrawal date was formally approved and never changed.',
  },
  {
    kind: 'inspection_images',
    family: 'retention',
    title: 'The erased inspection images',
    charge: 'erasing inspection images before their retention period ended',
    subject: 'the inspection images',
    unit: 'days',
    context:
      'You authorized erasure of the only retained images. The inspection case’s recorded closure date is final.',
  },
  {
    kind: 'procurement_vote',
    family: 'quorum',
    title: 'The procurement decision',
    charge:
      'implementing a procurement decision without the required approval quorum',
    subject: 'the procurement decision',
    unit: 'approvers',
    context:
      'You implemented the decision after collecting the listed approvals. The register contains every authorized approver and every submitted approval.',
  },
  {
    kind: 'trust_disbursement',
    family: 'quorum',
    title: 'The trustees’ release',
    charge: 'releasing trust funds without the required approval quorum',
    subject: 'the trust release',
    unit: 'approvers',
    context:
      'You released the funds. The trust register contains all eligible trustees and every approval for this specific release.',
  },
  {
    kind: 'research_access',
    family: 'quorum',
    title: 'The dataset approval',
    charge: 'granting dataset access without the required approval quorum',
    subject: 'the dataset access decision',
    unit: 'approvers',
    context:
      'You activated access for the named project. The committee register and the signed approvals are complete for this decision.',
  },
  {
    kind: 'reserve_transfer',
    family: 'quorum',
    title: 'The reserve decision',
    charge: 'moving reserve funds without the required approval quorum',
    subject: 'the reserve transfer',
    unit: 'approvers',
    context:
      'You executed the transfer. The board register and approval file contain all eligible directors and all approvals for this transfer.',
  },
  {
    kind: 'pressure_vessel',
    family: 'interlock',
    title: 'The chamber opening',
    charge:
      'opening a chamber while its required release conditions were unmet',
    subject: 'the chamber opening',
    unit: 'units',
    context:
      'You operated the release control. The calibrated gauges were read at that instant, and no emergency override was authorized.',
  },
  {
    kind: 'battery_dispatch',
    family: 'interlock',
    title: 'The battery dispatch',
    charge:
      'dispatching a battery while its required release conditions were unmet',
    subject: 'the battery dispatch',
    unit: 'units',
    context:
      'You signed the dispatch order. The two validated diagnostic readings describe this battery at the instant of dispatch.',
  },
  {
    kind: 'gas_transfer',
    family: 'interlock',
    title: 'The gas transfer',
    charge:
      'starting a transfer while its required start conditions were unmet',
    subject: 'the gas transfer',
    unit: 'units',
    context:
      'You operated the transfer control. The two checked sensor readings were taken at startup, and neither sensor was bypassed.',
  },
  {
    kind: 'furnace_access',
    family: 'interlock',
    title: 'The furnace access',
    charge: 'opening a furnace while its required access conditions were unmet',
    subject: 'the furnace opening',
    unit: 'units',
    context:
      'You opened the access door. The two calibrated instruments recorded the conditions at that moment; no emergency exception applied.',
  },
] as const;
