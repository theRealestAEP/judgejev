// Each tuple is a complete exhibit choice: supported, alternative, unresolved.
// Keep the five exhibits in story order: incident, identification, trace, access, corroboration.
type Exhibit = string | readonly [string, string, string];
type Story = {
  title: string;
  category: 'HOMICIDE' | 'ASSAULT' | 'BURGLARY' | 'ROBBERY' | 'FRAUD' | 'ARSON';
  accusation: string;
  evidence: readonly [Exhibit, Exhibit, Exhibit, Exhibit, Exhibit];
  issue: string;
};

export const stories = {
  canal: {
    title: 'Death at the canal',
    category: 'HOMICIDE',
    accusation:
      'You are accused of holding a walker underwater at the {place} canal on {time}, causing their death.',
    evidence: [
      'Medical report: the walker died by drowning. A towpath recording on {time} shows two people struggling at the water’s edge.',
      [
        'Bridge camera: the defendant’s face is clear while they push the walker into the canal and hold them under. The recording includes the approach.',
        'Bridge camera: the defendant is at the bank reaching toward the walker. A railing hides their hands and the moment the walker enters the water.',
        'Runner’s statement: the runner recognizes the defendant leaning over the walker in the water. The runner arrived after hearing a splash.',
      ],
      'Search on {next}: mud and canal water were found on the defendant’s coat. The defendant says they entered the water to help.',
      [
        'Full recording: the walker tries to climb out twice. The defendant forces their head down both times, then walks away.',
        'Emergency call: the defendant asks for an ambulance and says the walker fell during an argument. The call begins while the walker is still in the water.',
        'Emergency call: another walker reports a fight, then shouts that someone is pulling a person from the canal. The caller cannot identify who started the struggle.',
      ],
      [
        'Witness statement: a boat owner saw the defendant leave while the walker remained submerged. The owner then tried to rescue the walker.',
        'Boat owner’s statement: the defendant had argued with the walker and grabbed their coat before the splash. The owner could not see whether the grab was a push or an attempt to steady them.',
        'Boat owner’s statement: the defendant and walker had been shouting at each other. The owner saw the defendant leave the bank after the runner arrived.',
      ],
    ],
    issue:
      'Distinguish an attack from a rescue attempt using the actions before and after the splash; wet clothing alone cannot settle that question.',
  },
  dinner: {
    title: 'The dinner guest',
    category: 'HOMICIDE',
    accusation:
      'You are accused of deliberately poisoning a guest’s drink at a dinner in {place} on {time}, causing their death.',
    evidence: [
      'Medical and laboratory reports: the guest died from poison found in their glass. Other guests drank from the same bottle and remained well.',
      [
        'Kitchen camera: the defendant is clearly recorded adding liquid from a small vial to that glass before handing it to the guest.',
        'Host’s statement: the defendant carried the glass from the kitchen. The host did not see it being filled.',
        'Kitchen camera: someone in the defendant’s apron handles the glass. Their face is outside the frame.',
      ],
      'Search on {next}: a vial with matching poison residue was found in the defendant’s kitchen bag. The defendant’s print was on its cap.',
      [
        'Phone messages from {previous}: the defendant describes a plan to poison this guest. The recipient confirms that the defendant sent the messages during their conversation.',
        'Photograph from {earlier}: another cook put the vial in the bag with pest-control supplies. Both cooks used the kitchen; the glass stood unattended before service.',
        'Kitchen roster: two cooks shared the bag and apron. The defendant handled the vial during pest-control work the previous week.',
      ],
      [
        'Host’s statement: the defendant chose the guest’s glass and kept it separate until serving it. The guest had not threatened the defendant.',
        'Guest’s partner: the defendant and guest argued shortly before dinner. The defendant volunteered to serve the guest’s drink.',
        'Host’s statement: the defendant asked to serve this guest and left the kitchen with the glass. The host saw the other cook leave just beforehand.',
      ],
    ],
    issue:
      'Trace the particular glass and vial through the kitchen. Prior handling of poison and serving a drink need to be weighed against who could have altered it.',
  },
  car_park: {
    title: 'The car park collision',
    category: 'HOMICIDE',
    accusation:
      'You are accused of deliberately driving into a pedestrian in a {place} car park on {time}, causing their death.',
    evidence: [
      'Medical and scene reports: the pedestrian died from the collision. Camera footage shows the defendant’s car crossing an empty parking bay toward them.',
      'Entrance camera: the defendant is clearly visible driving into the car park shortly before the collision and remains in the driver’s seat afterward.',
      [
        'Vehicle examination on {next}: the brakes and steering worked normally. Recorded pedal data shows sustained acceleration until impact.',
        'Vehicle examination on {next}: a damaged pedal fitting could catch the accelerator. The examiner cannot establish whether it was damaged before the collision.',
        'Vehicle examination on {next}: the car’s data recorder failed in the crash. Mechanical damage prevents a reliable test of the accelerator.',
      ],
      [
        'Full footage: the pedestrian moves aside; the car changes direction to follow and strikes them. The route to the exit remained clear.',
        'Full footage: the car strikes a barrier immediately after the pedestrian. The brake lights illuminate before impact, while the engine remains at high speed.',
        'Full footage: the car turns toward the pedestrian, but a parked van blocks the last few metres before impact.',
      ],
      [
        'Phone recording: immediately beforehand, the defendant tells the pedestrian they will run them down. The recording captures the engine starting.',
        'Witness statement: the defendant had threatened the pedestrian during an argument. After the collision, the defendant stayed and called an ambulance.',
        'Witness statement: the defendant had argued with the pedestrian and sounded the horn before moving. The witness could not hear words from inside the car.',
      ],
    ],
    issue:
      'The defendant drove the car; the issue is whether the collision was deliberate. Compare the steering, mechanical evidence, and conduct before impact.',
  },
  rehearsal: {
    title: 'The rehearsal room shooting',
    category: 'HOMICIDE',
    accusation:
      'You are accused of deliberately shooting a bandmate in a {place} rehearsal room on {time}, causing their death.',
    evidence: [
      'Medical report and room recording: a single gunshot killed the bandmate during rehearsal. The recording preserves an argument followed by the shot.',
      [
        'Room camera: the defendant is clearly shown pointing the gun at the seated bandmate and firing. The bandmate’s hands remain on the table.',
        'Drummer’s statement: the defendant held the gun immediately after the shot. A speaker blocked the drummer’s view of the trigger and the bandmate’s hands.',
        'Hallway witness: the defendant ran from the room holding the gun. The witness heard the shot but did not see it fired.',
      ],
      'Laboratory report on {lab}: the recovered gun fired the fatal bullet. The defendant’s print was on the grip.',
      [
        'Full recording: the defendant takes the gun from a bag during the argument. Nobody else reaches for it before the shot.',
        'Full recording: the bandmate first brings out the gun. Both reach toward it before the view is blocked; the defendant says they tried to take it away.',
        'Booking record: another musician was inside the room when the shot occurred. That musician left through the rear door before police arrived.',
      ],
      [
        'Emergency call: another musician identifies the defendant as the shooter while describing the scene. Their account matches the full camera sequence.',
        'Medical report: both people had fresh hand injuries consistent with a struggle. The defendant had also threatened the bandmate earlier in the recorded argument.',
        'Drummer’s statement: the defendant and bandmate had argued over missing money. The drummer saw the defendant holding the gun afterward, but entered after the shot.',
      ],
    ],
    issue:
      'A print and possession after the shot establish handling. Determine whether the public record establishes deliberate firing, an accidental struggle, or another shooter.',
  },
  quarry: {
    title: 'The quarry edge',
    category: 'HOMICIDE',
    accusation:
      'You are accused of deliberately pushing a surveyor from a quarry ledge in {place} on {time}, causing their death.',
    evidence: [
      'Medical and site reports: the surveyor died in a fall from the ledge. Fresh scrape marks were found beside the point where they fell.',
      [
        'Survey drone: clear footage shows the defendant shove the surveyor with both hands while the surveyor stands still, then look over the edge.',
        'Survey drone: the defendant reaches toward the surveyor as the ground gives way. Dust hides their hands and the surveyor’s footing.',
        'Distant camera: a person in the defendant’s orange jacket stands beside the surveyor before the fall. The camera cannot resolve faces.',
      ],
      'Search on {next}: the surveyor’s torn sleeve carries the defendant’s fingerprint in wet marking paint. The defendant says they grabbed the sleeve to stop the fall.',
      [
        'Site inspection: the filmed footing remained intact. The collapse visible in the later rescue footage occurred after the surveyor fell.',
        'Site inspection: the ledge had a fresh collapse under the surveyor’s position. A warning about loose rock had been issued that morning.',
        'Site roster: two staff wore the same orange jackets. Both were working near the ledge and had access to the defendant’s work vehicle.',
      ],
      [
        'Radio recording: another surveyor reports seeing the defendant push, before anyone discusses a possible accident.',
        'Radio recording: the defendant calls for rescue immediately. A coworker also reports hearing the defendant threaten the surveyor before they went to the ledge.',
        'Radio recording: a coworker reports an argument involving the defendant near the ledge. The report gives no view of the fall itself.',
      ],
    ],
    issue:
      'The sleeve trace connects the defendant to contact. Assess whether the footage and ground condition establish a push rather than an attempted rescue.',
  },
  fishing_boat: {
    title: 'Death aboard the trawler',
    category: 'HOMICIDE',
    accusation:
      'You are accused of striking a crewmate with a metal weight aboard a fishing boat at {place} on {time}, causing their death.',
    evidence: [
      'Medical report: the crewmate died from a head injury matching the metal weight recovered beside the winch. The boat was tied at the dock.',
      [
        'Deck camera: the defendant lifts the weight and strikes the crewmate, who has turned away. The defendant’s face is clear.',
        'Deck camera: the defendant and crewmate struggle beside the winch. A hanging net hides the impact; the weight falls into view afterward.',
        'Deck camera: a person in waterproof clothing bends over the crewmate. Spray covers the lens during the impact.',
      ],
      'Laboratory report on {lab}: the crewmate’s blood and the defendant’s palm print were found on the weight. It was an ordinary item used by the crew.',
      [
        'Full recording: the winch is stopped throughout. The defendant picks the weight up from the deck before the strike.',
        'Safety inspection: the winch guard was loose. The crewmate had started the winch, and the defendant says they pulled them away from its moving cable.',
        'Dock footage: another crew member boards shortly before the death and leaves before the camera lens clears. Both crew members wore similar waterproofs.',
      ],
      [
        'Witness statement: a dock worker saw the defendant hide the weight under a net after the strike. The camera records the same action.',
        'Witness statement: the defendant had argued with the crewmate, then called for help. The witness saw blood on the defendant’s hands but did not see the injury occur.',
        'Witness statement: the defendant was found beside the crewmate holding the weight. The defendant says they moved it while trying to help.',
      ],
    ],
    issue:
      'Distinguish ordinary handling or rescue contact from an intentional blow. The winch and the missing view of the impact matter in the contested records.',
  },
  bar_glass: {
    title: 'The broken glass',
    category: 'ASSAULT',
    accusation:
      'You are accused of deliberately striking a customer with a glass at a {place} bar on {time}, causing a facial injury.',
    evidence: [
      'Clinic report: the customer needed stitches after a glass broke against their face. Bar footage places the defendant directly in front of them.',
      [
        'Bar camera: the defendant lifts the glass and swings it at the customer’s face. The customer stands still with both hands on the bar.',
        'Bar camera: the customer grabs the defendant’s collar. The defendant raises the glass; another customer blocks the moment of contact.',
        'Bar camera: a crowd surges between the defendant and customer. The defendant holds a glass, but the impact is hidden.',
      ],
      'Scene photograph: broken glass from the defendant’s drink lay on the floor. The defendant agrees that the glass was in their hand.',
      [
        'Full footage: there is clear space behind the defendant. The customer makes no threatening movement before the swing.',
        'Door camera: the customer had followed the defendant after being asked to leave them alone. A bartender heard the defendant say, "Let go."',
        'Bartender’s statement: someone bumped the defendant’s arm as the crowd moved. The bartender cannot tell whether the arm was already swinging.',
      ],
      [
        'Bartender’s statement: the defendant said they would hit the customer, then did so. The camera sequence matches the account.',
        'Customer’s statement: the customer admits grabbing the collar but says they had released it before being struck. The blocked view does not settle the order.',
        'Customer’s statement: the defendant had threatened them earlier. The customer felt the blow but could not see the defendant’s arm through the crowd.',
      ],
    ],
    issue:
      'The glass caused the injury. The disputed questions are intention, the effect of the crowd, and whether force was needed when contact occurred.',
  },
  taxi_rank: {
    title: 'The taxi queue',
    category: 'ASSAULT',
    accusation:
      'You are accused of deliberately kicking a passenger in the taxi queue at {place} on {time}, breaking their leg.',
    evidence: [
      'Clinic and rank-camera records: a passenger falls after a kick to the leg. Two people had been arguing over their place in the queue.',
      [
        'Driver’s camera: the defendant’s face is clear as they deliver the kick. The passenger is standing with their hands at their sides.',
        'Driver’s camera: the passenger raises a bottle toward the defendant. The kick follows; a taxi door hides whether the bottle had been lowered.',
        'Rank camera: someone wearing the defendant’s coat kicks the passenger. An umbrella hides the attacker’s face.',
      ],
      'Shoe examination on {next}: the injury pattern is consistent with the defendant’s boots. The examiner says many boots have the same sole.',
      [
        'Full footage: the passenger never holds a bottle or approaches the defendant. The defendant steps forward to kick.',
        'Passenger’s statement: the passenger admits raising the bottle but says they were putting it away. The defendant says they expected to be struck.',
        'Queue witness: another person in the same style of coat was beside the defendant. The witness lost sight of both when the umbrella opened.',
      ],
      [
        'Driver’s statement: the driver saw the whole incident and knew the defendant from regular trips. Their account matches the close footage.',
        'Driver’s statement: the defendant had a clear path backward. The driver could see the raised bottle but not the passenger’s hands during the kick.',
        'Driver’s statement: the defendant was arguing with the passenger immediately beforehand and left the queue after the kick.',
      ],
    ],
    issue:
      'Weigh identification and the immediate threat separately. A common boot pattern or an earlier argument is one link in the record.',
  },
  football_exit: {
    title: 'Outside the stadium',
    category: 'ASSAULT',
    accusation:
      'You are accused of punching a steward outside the {place} stadium on {time}, breaking their nose.',
    evidence: [
      'Medical report and exit camera: a steward is punched while directing supporters away from a closed gate.',
      [
        'Close camera: the defendant’s uncovered face is clear as they punch the steward. The steward is pointing toward the open exit.',
        'Close camera: the steward grips the defendant’s wrist against a railing. A banner blocks the blow and the moment the grip ends.',
        'Exit camera: the attacker wears the same team scarf as the defendant. The face is hidden among several supporters.',
      ],
      'Photograph on {later}: the defendant has scraped knuckles. The defendant says they scraped them against the exit railing.',
      [
        'Full footage: the steward never touches the defendant before the punch. The defendant turns back from the open exit to strike.',
        'First-aid record: the defendant’s wrist has fresh pressure marks. The defendant complained that the steward was hurting it before the blow.',
        'Steward’s first description: the attacker had a dark hat. The steward later named the defendant after seeing a police photograph showing their scarf.',
      ],
      [
        'Steward’s statement: they identified the defendant before seeing any photographs. Their account matches the clear camera view.',
        'Second steward: the first steward was trying to restrain the defendant, who had tried to pass the barrier. The witness did not see the precise release or blow.',
        'Second steward: the defendant was shouting at the injured steward before the crowd moved. The witness could not see who punched.',
      ],
    ],
    issue:
      'Separate the injury from who delivered it and the force used during restraint. Shared clothing and prompted recognition need careful weight.',
  },
  dog_attack: {
    title: 'The yard gate',
    category: 'ASSAULT',
    accusation:
      'You are accused of deliberately setting a dog on a delivery driver at a {place} yard on {time}, causing bite injuries.',
    evidence: [
      'Clinic and door-camera records: the dog runs from the yard and bites the delivery driver beside the gate.',
      'Door camera: the defendant stands beside the gate when the dog gets out. The dog belongs to the defendant.',
      [
        'Camera audio: the defendant points at the driver and orders the dog to attack. They hold the gate open until the dog passes.',
        'Camera audio: the defendant shouts as the gate opens, but a passing truck masks the words. Their hand is near the latch.',
        'Camera audio: the defendant argues with the driver. The view of the gate latch is blocked by a parcel.',
      ],
      [
        'Gate inspection on {next}: the latch works normally. Footage clearly shows the defendant lift it before the attack.',
        'Gate inspection on {next}: a bent latch can spring open under pressure. The driver had leaned a heavy parcel against the gate.',
        'Driver’s statement: the driver opened the gate to retrieve a dropped receipt. The defendant says they were trying to close it when the dog ran through.',
      ],
      [
        'Full recording: the driver remains outside the yard and makes no threat. The defendant calls the dog back only after the attack.',
        'Driver’s statement: the defendant had threatened to release the dog. The full recording also shows the defendant pulling the dog away once the bite begins.',
        'Full recording: the defendant had threatened the driver, then moved toward the gate. The recording does not show which person moved the latch.',
      ],
    ],
    issue:
      'Owning the dog establishes responsibility for its care, but this charge alleges a deliberate attack. Identify what proves intentional release or direction.',
  },
  cycle_path: {
    title: 'The path collision',
    category: 'ASSAULT',
    accusation:
      'You are accused of deliberately knocking a cyclist from their bicycle on the {place} path on {time}, breaking their shoulder.',
    evidence: [
      'Helmet camera and clinic report: the cyclist falls after contact with a pedestrian at the narrow section of the path.',
      'Park camera: the defendant is the pedestrian involved. They agree that their arm made contact with the cyclist.',
      [
        'Helmet video: the defendant waits for the bicycle and thrusts an arm into the rider’s chest. There is clear space beside the path.',
        'Helmet video: the bicycle swerves toward the defendant. Their arm rises, but the lens points down before contact.',
        'Park camera: the defendant steps sideways as another walker approaches. Tree branches hide the final movement of the arm.',
      ],
      [
        'Path survey: both people had a clear view. The defendant had stepped onto the path after watching the cyclist approach.',
        'Path survey: a fallen branch narrowed the path. The cyclist had to steer close to the defendant to pass.',
        'Second walker’s statement: the defendant lost their balance on the verge. The walker cannot tell whether the arm contact was a grab or an attempt to steady themselves.',
      ],
      [
        'Camera audio: the defendant shouts that they will knock the cyclist off, then makes the recorded movement.',
        'Camera audio: the defendant shouts angrily at the cyclist before contact. The defendant says they raised their arm to protect their face.',
        'Cyclist’s statement: the defendant had argued with them earlier on the path. The cyclist believed the movement was deliberate but saw it only just before falling.',
      ],
    ],
    issue:
      'Contact and injury are established. Decide whether the movement was an intentional attack, protection from a collision, or a loss of balance.',
  },
  security_gate: {
    title: 'The warehouse gate',
    category: 'ASSAULT',
    accusation:
      'You are accused of unlawfully spraying a visitor in the face at a {place} warehouse gate on {time}, causing an eye injury.',
    evidence: [
      'Clinic report and gate footage: a visitor suffers an eye injury when the defendant uses a handheld spray. Both faces are clear.',
      [
        'Full gate video: the visitor waits behind the marked line with empty hands. The defendant walks over and sprays them after an argument.',
        'Gate video: the visitor reaches inside their coat and advances. A gatepost blocks the hand just before the defendant sprays.',
        'Gate video: the visitor pushes the gate against the defendant’s shoulder. The spray follows after the visitor steps back.',
      ],
      'Security report: the defendant was guarding the warehouse. The spray was issued for protection against an immediate physical threat.',
      [
        'Visitor’s appointment record: the visitor was expected and had shown identification. The recording contains no threat or attempt to enter.',
        'Search record: a phone was inside the visitor’s coat; no weapon was found. The defendant says they believed a weapon was being drawn.',
        'Medical photograph on {later}: the defendant has a bruise where the gate struck. The visitor says the contact was accidental.',
      ],
      [
        'Coworker’s statement: the defendant said they wanted to punish the visitor for insulting them. The coworker watched the approach and spray.',
        'Coworker’s statement: the visitor had threatened the defendant moments earlier. The coworker saw the advance but could not see inside the coat.',
        'Coworker’s statement: the visitor was still within arm’s reach after stepping back. The witness heard the defendant order them to leave before the spray.',
      ],
    ],
    issue:
      'The use of force is clear. Assess the threat reasonably apparent at that moment and whether that particular use of force was justified.',
  },
  museum: {
    title: 'The missing bronze',
    category: 'BURGLARY',
    accusation:
      'You are accused of breaking into the {place} museum on {time} and stealing a bronze figure from a locked display.',
    evidence: [
      'Alarm and display records: an intruder breaks the rear window and the display lock. The bronze figure is missing when police arrive.',
      [
        'Gallery camera: a clear face view identifies the defendant removing the figure and leaving through the broken window.',
        'Gallery camera: the intruder wears the same unusual patched jacket as the defendant. A mask covers the face.',
        'Guard’s statement: the guard recognizes the intruder’s walk as the defendant’s. The guard sees the person only from behind.',
      ],
      'Search on {next}: the bronze is found in a padded case in the defendant’s workshop. Its inventory mark matches the museum record.',
      [
        'Workshop camera: the defendant brings the case inside on {later} and locks it in their personal cabinet.',
        'Workshop key log: a colleague borrowed the defendant’s jacket and workshop key that afternoon. The case was found in the shared packing area.',
        'Delivery record on {later}: a courier leaves the case at the shared workshop. The sender’s name is false; the defendant signs for the delivery.',
      ],
      [
        'Museum access list: the defendant’s restoration job ended the previous week. The museum had granted no permission to remove the figure.',
        'Museum access list: the defendant had recently restored the display and knew the rear window. The colleague also helped with that work.',
        'Museum email from {previous}: the defendant asked to buy the figure and was refused. The museum authorized no collection or delivery.',
      ],
    ],
    issue:
      'The missing figure was recovered at the defendant’s workplace. Assess the entry identification and how the figure arrived there before attributing the burglary.',
  },
  bike_shop: {
    title: 'The shuttered bicycle shop',
    category: 'BURGLARY',
    accusation:
      'You are accused of forcing the shutter of a bicycle shop in {place} on {time} and stealing two electric bicycles.',
    evidence: [
      'Shop camera: a person forces the shutter, wheels out two bicycles, and loads them into a van. The owner authorized no removal.',
      [
        'Street camera: a clear face view shows the defendant loading both bicycles and driving away.',
        'Street camera: the van belongs to the defendant, but the driver’s face is covered by the lowered sun visor.',
        'Neighbour’s statement: the loader resembled the defendant. The neighbour watched through a rain-covered upstairs window.',
      ],
      'Tracker record: one stolen bicycle is found in the defendant’s garage on {next}. Its frame number matches the shop inventory.',
      [
        'Garage camera: the defendant unloads the two bicycles directly from the van shortly after the break-in.',
        'Messages from {previous}: the defendant lent the van and garage key to a riding partner to collect bicycles. The return time was never recorded.',
        'Garage records: the defendant runs a repair service there. A customer delivered the bicycle before police arrived; the receipt names a person police have not located.',
      ],
      [
        'Sales messages: the defendant offers both stolen frame numbers for sale on {later}. The buyer’s video call identifies the defendant and the bicycles.',
        'Owner’s statement: the defendant had inspected both bicycles that week and asked about the shutter. The riding partner also visited the shop.',
        'Sales messages: the defendant advertised the recovered bicycle soon after delivery. The listing calls it their own bicycle; the defendant says they were selling it for the customer.',
      ],
    ],
    issue:
      'Trace possession from the shop to the garage. A tracker locates the bicycle; it does not by itself identify who forced the shutter.',
  },
  apartment: {
    title: 'The ransacked flat',
    category: 'BURGLARY',
    accusation:
      'You are accused of forcing a neighbour’s flat door in {place} on {time} and stealing a laptop and jewellery.',
    evidence: [
      'Door camera and inventory: an intruder forces the locked door while the resident is away. The resident’s laptop and jewellery are missing afterward.',
      [
        'Landing camera: the defendant’s face is clear as they force the door and carry out the resident’s laptop bag.',
        'Landing camera: the intruder’s coat and height match the defendant’s. Their head is turned away throughout.',
        'Resident’s statement: the resident recognizes the intruder’s bag as one previously used by the defendant. The camera does not show a face.',
      ],
      'Search on {next}: the stolen laptop is in a cupboard in the defendant’s flat. The serial number matches the resident’s purchase receipt.',
      [
        'Flat-entry camera: the defendant arrives alone with the laptop bag on {later}. The cupboard is in their locked bedroom.',
        'Housemate’s statement: the housemate bought the laptop from a visitor that evening. Messages mention a purchase, but neither the seller nor a price is recorded.',
        'Property manager’s record: the defendant and two housemates share the cupboard. All three were in the building that evening.',
      ],
      [
        'Device record: the defendant resets the laptop on {later} using their personal account. Recovery photographs show the stolen jewellery beside it.',
        'Door photograph: the defendant’s print is on the outside handle. The resident confirms the defendant helped carry furniture through that door the previous week.',
        'Device record: the laptop connects to the defendant’s home network after the break-in. The record identifies the router, not the user.',
      ],
    ],
    issue:
      'The stolen laptop connects the home to the offence. Weigh personal possession, shared access, and the quality of the entry identification.',
  },
  school_office: {
    title: 'The school office safe',
    category: 'BURGLARY',
    accusation:
      'You are accused of entering a locked school office in {place} on {time} and stealing cash from its safe.',
    evidence: [
      'Office camera: someone enters after closing, opens the safe, and removes the cash bag. The school authorized no evening cash collection.',
      [
        'Office camera: the defendant’s face is clear throughout entry, safe opening, and removal of the bag.',
        'Office camera: the intruder wears the same work uniform as the defendant. A hood covers the face.',
        'Caretaker’s statement: the intruder’s voice sounded like the defendant’s when they called through a side door. The caretaker did not see their face.',
      ],
      'Key record: the office opens with the spare key assigned to the defendant. The door shows no forced entry.',
      [
        'Key cabinet camera: the defendant takes the spare key on {earlier} and keeps it until police stop them with the cash bag.',
        'Key cabinet camera: a relief worker takes the spare key on {earlier}. The defendant later enters the cabinet area, outside the camera’s view.',
        'Staff messages: the spare key was routinely left in an unlocked desk. The defendant and relief workers knew the safe code.',
      ],
      [
        'Police record on {later}: the cash bag is found inside the defendant’s coat. Its numbered seal matches the school’s bank deposit slip.',
        'Search on {next}: the cash bag is in the defendant’s work locker. The locker latch is broken, and both workers used that changing room.',
        'Search on {next}: cash matching the missing amount is in the defendant’s home. The notes have no recorded serial numbers; the defendant says it was personal savings.',
      ],
    ],
    issue:
      'A key assignment establishes a route of access. Determine who held the key and what the recovered cash connects to the defendant personally.',
  },
  builders_yard: {
    title: 'The copper at the yard',
    category: 'BURGLARY',
    accusation:
      'You are accused of breaking into a locked store at the {place} builders’ yard on {time} and stealing copper cable.',
    evidence: [
      'Yard camera and stock count: a person cuts the store lock and loads three cable reels onto a truck. The reels were reserved for a customer.',
      [
        'Gate camera: the defendant’s face and truck plate are clear as they leave with the three reels.',
        'Gate camera: the truck plate matches the defendant’s truck. The driver keeps their face below the window.',
        'Guard’s statement: the guard identifies the defendant from a brief side view under the gate lamp. The original description mentions only build and a beard.',
      ],
      'Dealer’s record on {next}: the three numbered reels are sold using the defendant’s trade account. The dealer retains the original sale receipt.',
      [
        'Dealer’s camera: the defendant unloads the reels and personally receives the payment shown on the receipt.',
        'Truck messages: a coworker borrowed the truck and the trade-account card that day. The defendant also kept a truck key.',
        'Dealer’s camera: a cap hides the seller’s face. The dealer accepted the account card without checking identification.',
      ],
      [
        'Police search: the cut lock and freshly used cutting tool are found in the defendant’s truck, behind the driver’s seat.',
        'Police search: the cutting tool is in the returned truck. Both workers used it on legitimate jobs; the examination cannot identify its last user.',
        'Employer’s record: the defendant knew where the cable was kept and had recently asked what the dealer would pay for it. Several workers knew the store layout.',
      ],
    ],
    issue:
      'Connect the yard entry, truck use, and sale. Ownership of the truck or trade account must be weighed alongside evidence of the actual user.',
  },
  recording_studio: {
    title: 'The empty control room',
    category: 'BURGLARY',
    accusation:
      'You are accused of forcing entry to a recording studio in {place} on {time} and stealing a mixing console.',
    evidence: [
      'Alarm and owner’s report: the locked rear door is forced. A numbered mixing console is missing from the control room.',
      [
        'Hall camera: the defendant’s face is clear while they force the door and wheel the console out.',
        'Hall camera: the intruder wears a tour jacket like the defendant’s. A guitar case blocks their face.',
        'Sound engineer’s statement: the engineer recognizes the intruder’s voice on the hall recording. A second voice is also audible.',
      ],
      'Search on {next}: the missing console is in a rehearsal space hired by the defendant’s band. The serial number matches the studio’s record.',
      [
        'Room camera: the defendant brings the console inside on {later}. They tell the other musicians to cover its serial number.',
        'Band messages from {previous}: another musician arranged a console delivery and had the rehearsal-room key. The messages do not identify the seller.',
        'Room key log: all four band members could enter. The delivery camera was disconnected, and nobody records when the console arrived.',
      ],
      [
        'Studio booking records: the defendant’s session had ended and all equipment was checked back in. The owner had refused a request to borrow the console.',
        'Studio booking records: the defendant and the other musician both attended the last session. The owner confirms that neither had permission to take equipment.',
        'Sales listing on {next}: the defendant advertises the console as band equipment. The defendant says they believed another band member had bought it.',
      ],
    ],
    issue:
      'The console’s location is established. Decide whether the defendant stole it, helped move it, or encountered it after another person brought it in.',
  },
  boathouse: {
    title: 'The boathouse door',
    category: 'BURGLARY',
    accusation:
      'You are accused of breaking into the {place} rowing club’s boathouse on {time} and stealing an outboard motor.',
    evidence: [
      'Club alarm and inventory: the locked boathouse door is forced and the safety boat’s numbered outboard motor is removed.',
      [
        'Dock camera: the defendant’s face is clear while they carry the motor from the forced door to their trailer.',
        'Dock camera: the trailer plate belongs to the defendant. A waterproof hood hides the person moving the motor.',
        'Club member’s statement: the person moving the motor walked like the defendant. The member saw them across the water after dark.',
      ],
      'Search on {next}: the motor is attached to a boat in the defendant’s shared repair shed. Its serial number matches the club inventory.',
      [
        'Shed camera: the defendant unloads the motor on {later} and starts removing the club’s painted label.',
        'Repair diary from {previous}: a customer booked the trailer to move an engine and had the shed key. The defendant retained another key.',
        'Shed receipt on {later}: an unnamed customer left an engine for fitting. The receipt gives the stolen motor’s number and is in the defendant’s handwriting.',
      ],
      [
        'Club records: the defendant’s repair work had finished. The club had expressly refused permission to remove the motor.',
        'Club records: the defendant had repaired the motor and knew the shed layout. The customer had also visited the club with the defendant.',
        'Message to a buyer: the defendant offers the motor for sale that evening. The defendant says the customer had asked them to arrange a sale.',
      ],
    ],
    issue:
      'Separate the unlawful removal from later repair or sale. Trailer and shed access create concrete competing accounts that need to be compared with identification.',
  },
  laundry: {
    title: 'The laundrette collection',
    category: 'BURGLARY',
    accusation:
      'You are accused of forcing open a locked laundrette in {place} on {time} and stealing the machines’ cash boxes.',
    evidence: [
      'Shop camera: someone forces the closed front door and takes three locked cash boxes. The owner had scheduled no collection that night.',
      [
        'Interior camera: the defendant’s uncovered face is clear as they remove the boxes and put them into a trolley.',
        'Interior camera: the intruder wears a service coat like the defendant’s. The face is turned away.',
        'Neighbour’s statement: the intruder used the defendant’s distinctive red trolley. The neighbour did not see a face.',
      ],
      'Search on {next}: the three numbered boxes are in the defendant’s garage. The numbers match the machines shown in the footage.',
      [
        'Garage camera: the defendant wheels the trolley and boxes inside on {later}, then breaks open a box.',
        'Work messages from {previous}: a former coworker borrowed the coat and trolley. Both had keys to the garage, where they stored tools.',
        'Delivery camera on {later}: someone leaves the trolley in the open garage. The image shows only their back; the defendant comes home afterward.',
      ],
      [
        'Owner’s statement: the defendant knew the machines from earlier servicing. Their contract permitted repairs during opening hours, and never cash removal.',
        'Owner’s statement: the defendant and coworker both knew how to remove the boxes. The owner had recently refused the defendant an advance payment.',
        'Bank record on {next}: the defendant deposits coins close to the missing amount. The defendant says the coins came from another repair job.',
      ],
    ],
    issue:
      'The boxes identify stolen property. Trace the trolley’s use and the time of arrival rather than treating the garage address as complete proof of entry.',
  },
  taxi_fare: {
    title: 'The final taxi fare',
    category: 'ROBBERY',
    accusation:
      'You are accused of threatening a taxi driver with a knife in {place} on {time} and taking the driver’s cash.',
    evidence: [
      'Taxi recording: the rear passenger holds a knife toward the driver and demands the cash pouch. The driver hands it over and the passenger leaves.',
      [
        'Cabin camera: the defendant’s uncovered face is clear during the demand and taking.',
        'Cabin camera: the passenger resembles the defendant, but a mask hides the lower face. The driver saw them mainly through the mirror.',
        'Driver’s statement: the passenger sounded like the defendant, whom the driver has carried before. The cabin camera failed.',
      ],
      'Booking record: the ride was ordered through the defendant’s account and collected outside their building.',
      [
        'Pickup camera: the defendant gets into the taxi alone. The uninterrupted cabin recording follows that person through the robbery.',
        'Account messages: the defendant booked the ride for a housemate. A message sent before pickup names the housemate as the passenger.',
        'Account access report: both the defendant and a housemate used the saved login. The booking record identifies the account, not the person holding the phone.',
      ],
      [
        'Police record on {later}: the driver’s numbered pouch is found inside the defendant’s jacket. The driver identified the defendant before the search.',
        'Police record on {next}: the pouch is in the building’s shared hallway cupboard. The defendant’s gloves lie beside it; both residents used the cupboard.',
        'Pickup camera: a person of the defendant’s build leaves the building wearing a similar coat. The housemate is of similar height and had borrowed that coat.',
      ],
    ],
    issue:
      'Follow the passenger from pickup through the taking. A booking account may belong to someone other than the passenger.',
  },
  night_deposit: {
    title: 'The night deposit bag',
    category: 'ROBBERY',
    accusation:
      'You are accused of striking a shop manager outside a {place} bank on {time} and taking the shop’s deposit bag.',
    evidence: [
      'Bank entrance camera: an attacker knocks the manager down and takes the sealed deposit bag. The clinic records a broken collarbone.',
      [
        'Entrance camera: the attacker’s face is clear and matches the defendant. The manager recognizes a former employee.',
        'Manager’s statement: the attacker looked like the defendant. The manager saw a face briefly before being struck from behind.',
        'Entrance camera: the attacker wears the defendant’s old shop uniform. A hood and the camera angle hide the face.',
      ],
      'Search on {next}: the numbered deposit bag is under the driver’s seat of the defendant’s car. The bank slip inside identifies the shop.',
      [
        'Street cameras: an uninterrupted sequence follows the defendant from the attack into that car and through the driver’s door.',
        'Car messages from {earlier}: the defendant lent the car to a former coworker. The coworker knew the deposit route and returned the car before the search.',
        'Car key record: the defendant and a housemate both used the car. A street camera shows the attacker enter it but cannot identify the driver.',
      ],
      [
        'Shop messages: the defendant asks the manager when the deposit will be made, then waits outside the bank at that time.',
        'Shop messages: the defendant had asked when the deposit would be made. The defendant says the coworker asked them to find out.',
        'Shop rota: the defendant knew the deposit routine from earlier work. Several current and former staff knew the same route.',
      ],
    ],
    issue:
      'The deposit bag and route knowledge support the charge. Check whether the record identifies the attacker or only a car and shared knowledge.',
  },
  phone_snatch: {
    title: 'The phone at the crossing',
    category: 'ROBBERY',
    accusation:
      'You are accused of shoving a pedestrian at a {place} crossing on {time} and taking their phone.',
    evidence: [
      'Crossing camera: a person shoves the pedestrian to the ground and runs away with the phone. The pedestrian reports a sprained wrist.',
      [
        'Shop camera: a clear continuous view shows the defendant make the shove, take the phone, and run into the alley.',
        'Shop camera: the attacker wears a helmet and a jacket like the defendant’s. The face is hidden.',
        'Pedestrian’s statement: the attacker resembled the defendant. The pedestrian saw them for a second while turning toward the traffic lights.',
      ],
      'Tracking record on {later}: police recover the phone from the defendant’s jacket. Its serial number matches the pedestrian’s receipt.',
      [
        'Body camera: before being told which phone was stolen, the defendant describes the shove and the owner falling beside the traffic light.',
        'Message sent on {later}: the defendant tells a friend they bought a cheap phone in the alley. The message predates police contact but identifies no seller.',
        'Witness statement: someone handed the defendant a phone at the alley entrance shortly after the shove. The witness could not see that person’s face.',
      ],
      [
        'Street footage: the defendant keeps the phone from the crossing until police arrive. Nobody else approaches or hands them anything.',
        'Search record: the defendant has a helmet like the attacker’s and is close to the crossing. The jacket is a common delivery uniform.',
        'Street footage: the defendant was waiting by the alley before the attack and left with the phone. The footage does not show whether they knew the attacker’s plan.',
      ],
    ],
    issue:
      'Possession soon afterward is significant. Decide whether the record establishes participation in the shove and taking, or receiving the phone afterward.',
  },
  jewelry_delivery: {
    title: 'The jeweller’s delivery',
    category: 'ROBBERY',
    accusation:
      'You are accused of threatening a jewellery courier at a {place} hotel on {time} and taking a case of rings.',
    evidence: [
      'Lift camera: a person blocks the courier’s exit, displays a knife, and takes the numbered ring case.',
      [
        'Lift camera: the defendant’s face is clear throughout the threat. The courier recognizes the defendant from previous deliveries.',
        'Lift camera: a scarf hides the robber’s lower face. The courier associates the eyes and voice with the defendant.',
        'Courier’s statement: the robber knew the courier’s name and delivery time. The courier thinks the voice was the defendant’s, but had spoken to them only twice.',
      ],
      'Hotel access record: the lift was called using a room card issued in the defendant’s name.',
      [
        'Desk camera: the defendant collects the card and immediately enters the lift alone. The lift recording continues through the robbery.',
        'Reception record: the defendant requested a second card for a colleague that afternoon. Both cards share the room number in the lift log.',
        'Reception camera: the defendant leaves the card on the lobby table. Another person picks it up before the courier arrives; the camera does not show a face.',
      ],
      [
        'Search on {later}: police find the ring case and knife in the defendant’s locked suitcase. The case seal matches the delivery note.',
        'Search on {next}: the ring case is in the shared hotel room. Both occupants knew the delivery schedule and could enter the room.',
        'Message record: the defendant had asked the courier to use this hotel. The defendant says they were arranging a legitimate viewing for the colleague.',
      ],
    ],
    issue:
      'Distinguish a room-card record from the identity of its user, and weigh the courier’s recognition against actual access to the room and delivery schedule.',
  },
  arcade: {
    title: 'The arcade closing shift',
    category: 'ROBBERY',
    accusation:
      'You are accused of threatening an arcade attendant in {place} on {time} and taking the evening cash takings.',
    evidence: [
      'Counter recording: a robber points a handgun-shaped object at the attendant and orders them to empty the till. The attendant complies.',
      [
        'Counter camera: the defendant’s face is clear as they make the demand and take the notes. The attendant knows the defendant as a regular customer.',
        'Counter camera: a hood hides most of the face. The attendant recognizes a stammer and a jacket like the defendant’s.',
        'Attendant’s statement: the robber used a nickname for the attendant that the defendant also used. The camera image is too dark to show a face.',
      ],
      'Search on {next}: a replica handgun and the same type of jacket are found in the defendant’s shared flat.',
      [
        'Bedroom search: a marked note from the arcade’s till float is inside the defendant’s jacket. The float photograph records its serial number.',
        'Housemate’s statement: the housemate wore the jacket to a costume event that evening and owned the replica. Photos confirm their earlier use, but not where they went afterward.',
        'Property record: three residents had access to the replica and jacket. The defendant’s print is on the replica; the print cannot be dated.',
      ],
      [
        'Full recording: the defendant counts the notes into their pocket and leaves alone. No exchange with another person appears before police stop them.',
        'Phone record: the defendant’s phone connected to a mast serving the arcade and their flat. The mast record does not locate the phone at a particular building.',
        'Customer’s statement: the defendant was asking when the attendant worked alone. The defendant says they wanted to arrange a private repair appointment.',
      ],
    ],
    issue:
      'The threatening taking is established even if the gun was a replica. Focus on identification and who used the shared items that evening.',
  },
  cash_delivery: {
    title: 'The cash van stop',
    category: 'ROBBERY',
    accusation:
      'You are accused of helping rob a cash courier at a {place} delivery stop on {time} by driving the getaway car.',
    evidence: [
      'Courier footage: a masked robber threatens the courier with a knife, takes a cash box, and jumps into a waiting car that immediately drives away.',
      'Road camera: the defendant is clearly visible driving the waiting car. The charge concerns knowingly helping the robbery.',
      [
        'Car audio: before the robber gets out, the defendant says they will wait with the engine running while the courier is threatened.',
        'Car audio: the passenger says they need to collect a parcel. The defendant waits around the corner, with the courier outside their view.',
        'Car audio: the passenger tells the defendant to "be ready." Road noise masks the rest of their conversation.',
      ],
      [
        'Messages from {previous}: the defendant and passenger discuss the courier’s route and dividing the stolen cash. The passenger confirms the exchange.',
        'Phone call on {later}: the defendant calls police and reports that the passenger returned with a cash box and threatened them into driving away.',
        'Car camera: the passenger returns holding the box and keeps a hand inside their coat. The defendant appears to argue before driving.',
      ],
      [
        'Search on {next}: a share of the marked cash is found in the defendant’s locked bedside drawer.',
        'Search on {next}: the box is in the car’s boot. The courier says the car was already waiting before the robbery began.',
        'Bank record on {next}: the passenger sends the defendant {amount}. The defendant calls it repayment of a debt; there is no earlier written loan record.',
      ],
    ],
    issue:
      'Driving is admitted. Assess knowledge, agreement, and any immediate threat rather than treating presence in the car as proof of willing assistance.',
  },
  park_camera: {
    title: 'The photographer’s bag',
    category: 'ROBBERY',
    accusation:
      'You are accused of threatening a photographer on a {place} park path on {time} and taking their camera bag.',
    evidence: [
      'Photographer’s audio recording: someone threatens to strike the photographer unless they hand over the bag. The recording captures the bag being pulled away.',
      [
        'Park camera: the defendant’s face is clear as they corner the photographer, take the bag, and run away.',
        'Photographer’s statement: the robber had the defendant’s voice and build. The photographer saw the face briefly under a flickering path lamp.',
        'Park camera: the robber has the same large backpack as the defendant. Trees hide their face and upper body during the taking.',
      ],
      'Dealer’s record on {next}: the stolen camera is sold using the defendant’s identification. The serial number matches the photographer’s receipt.',
      [
        'Dealer’s camera: the defendant personally hands over the camera and receives cash. Their face and identification are both recorded.',
        'Dealer’s camera: the seller resembles the defendant but wears a cap. The defendant had reported their wallet missing on {previous}; the report lists the identification used.',
        'Defendant’s messages: the defendant admits selling the camera but says a friend asked them to do so. A message from before the sale supports a request to sell a camera.',
      ],
      [
        'Street footage: the defendant travels directly from the park with the bag and is later recorded entering the dealer’s shop.',
        'Search on {next}: the photographer’s lens pouch is in the defendant’s shared hallway. A friend with a similar build had stayed there that night.',
        'Photographer’s statement: the defendant had approached them to ask the camera’s value earlier that evening. The friend was present during that conversation.',
      ],
    ],
    issue:
      'A sale links the defendant to the property. Determine whether the record also identifies them as the person who made the threat and took it.',
  },
  train_luggage: {
    title: 'The luggage rack',
    category: 'ROBBERY',
    accusation:
      'You are accused of punching a passenger on a train at {place} on {time} and taking the passenger’s suitcase.',
    evidence: [
      'Train camera: an argument at the luggage rack ends with the defendant punching the passenger and leaving with a suitcase. The passenger suffers a split lip.',
      'Station camera: the defendant’s face is clear while carrying the suitcase off the train. The defendant agrees they delivered the punch.',
      [
        'Luggage photograph: the passenger’s name tag is plainly visible on the suitcase the defendant takes. The defendant’s own bag is a different colour.',
        'Luggage photograph: both people had the same model of suitcase. Their tags faced the wall; the defendant’s bag remained on the rack.',
        'Luggage photograph: the bags look alike. The defendant opened one compartment briefly before the argument, but the camera cannot show what they saw.',
      ],
      [
        'Train audio: the passenger identifies the case as theirs. The defendant replies that they will take it anyway, then punches.',
        'Train audio: the defendant says, "That is my case." The passenger grabs their wrist; the punch follows immediately.',
        'Passenger’s statement: the passenger showed a photograph of the contents before the punch. The defendant denies seeing the phone screen.',
      ],
      [
        'Search on {later}: the defendant has removed the passenger’s name tag and is sorting the passenger’s jewellery into their coat.',
        'Lost-property call on {later}: the defendant reports taking the wrong suitcase and arranges its return. The passenger says the force used to take it was deliberate.',
        'Search on {later}: the suitcase remains closed. The passenger’s name tag has fallen inside the outer pocket, and the defendant’s own case is still on the train.',
      ],
    ],
    issue:
      'The punch and taking are clear. Assess whether the defendant knowingly took another person’s property and what happened during the confrontation.',
  },
  concert_tickets: {
    title: 'The duplicated tickets',
    category: 'FRAUD',
    accusation:
      'You are accused of knowingly selling unusable concert tickets in {place} on {time} and taking {amount} from a buyer.',
    evidence: [
      'Buyer’s messages: the seller promises valid tickets and receives {amount}. At the venue, both tickets are rejected because their codes belong to tickets already used by other people.',
      [
        'Video call: the defendant’s face and voice are clear while they promise the tickets are genuine and ask for payment.',
        'Seller account: the messages come from the defendant’s account, which they share with a bandmate who also sells tickets.',
        'Video call: the defendant personally sells the tickets but says they obtained them from another reseller.',
      ],
      'Ticket office report: the same two ticket codes were copied into several listings. Each code originally entitled one person to enter.',
      [
        'Saved messages from {previous}: the defendant acknowledges that the codes have been sold already, then tells a friend they plan to sell more copies.',
        'Saved messages from {previous}: the bandmate uploaded the files. A warning that the codes were duplicated reached the shared inbox before the buyer paid.',
        'Reseller messages from {previous}: a supplier assured the defendant that the tickets were transferable. The defendant had also received a warning that one code might already have been used.',
      ],
      [
        'Payment record: the buyer’s money enters the defendant’s personal account. The defendant blocks the buyer immediately after payment.',
        'Payment record: the money enters the defendant’s personal account. Both account users had previously used it for ticket sales, and the defendant keeps the payment.',
        'Buyer’s complaint: the defendant refuses a refund after the rejection, saying the supplier has not returned the money. The listing described the tickets as guaranteed entry.',
      ],
    ],
    issue:
      'Invalid tickets and financial loss are established. Examine who made the sale and what that person knew about the duplicated codes before taking payment.',
  },
  rental_keys: {
    title: 'The false letting agent',
    category: 'FRAUD',
    accusation:
      'You are accused of posing as a letting agent in {place} on {time}, taking a renter’s deposit for a flat that was unavailable to rent.',
    evidence: [
      'Renter’s receipt and messages: a supposed agent takes {amount} for a flat and promises to hand over the keys. The flat is occupied and its owner had authorized no letting.',
      [
        'Viewing video: the defendant shows the flat, claims to represent its owner, and asks the renter to transfer the deposit.',
        'Viewing video: the guide resembles the defendant but is filmed mainly from behind. The receipt uses the defendant’s trading name.',
        'Viewing video: the defendant conducts the viewing and collects the deposit. They say another agent had instructed them to find a tenant.',
      ],
      'Owner’s record: the displayed permission letter carries a copied signature. The owner confirms that the flat was never offered through either agent.',
      [
        'Messages from {previous}: the owner told the defendant directly that the flat was occupied and could not be let. The defendant acknowledged the message.',
        'Office record: a former coworker retained the trading-name login and spare viewing keys. Both had previously worked at the property.',
        'Agency messages from {previous}: the other agent sent the forged letter to the defendant. An earlier owner’s message also told the defendant to stop arranging viewings.',
      ],
      [
        'Bank record: the deposit reaches the defendant’s personal account. Messages show the defendant sending the renter a false key-collection address.',
        'Bank record: the deposit reaches a business account controlled by the defendant. The former coworker also had payment access at the time.',
        'Bank record: the defendant keeps a commission and forwards the balance to the other agent. The renter never receives possession or a refund.',
      ],
    ],
    issue:
      'This charge concerns a knowingly false claim of authority over an unavailable flat. Assess identity and prior knowledge of the owner’s refusal.',
  },
  emergency_call: {
    title: 'The emergency caller',
    category: 'FRAUD',
    accusation:
      'You are accused of posing as a relative in distress in {place} on {time} and deceiving a pensioner into sending {amount}.',
    evidence: [
      'Recorded call: the caller claims to be the pensioner’s relative and asks for urgent help paying a hospital bill. The relative was well and made no such request.',
      [
        'Calling-service record: the call used the defendant’s phone. A room recording clearly shows the defendant speaking the same words during the call.',
        'Calling-service record: the call used the defendant’s phone number. The provider records a replacement SIM activation earlier that day.',
        'Calling-service record: the call used a phone shared by the defendant and a relative. The recording contains a voice altered by the calling app.',
      ],
      'Bank record: the pensioner transfers {amount} to the defendant’s account during the call. The caller had described that account as belonging to the hospital.',
      [
        'Phone examination on {next}: the defendant’s messages describe choosing this pensioner and pretending to be the relative. The message recipient confirms the conversation.',
        'Phone-shop record: someone used the defendant’s lost identification to obtain the replacement SIM. The shop image resembles the defendant but does not show the face clearly.',
        'Message from {previous}: the defendant gave the relative permission to use the phone and account to collect a repayment. The message does not mention a hospital or this pensioner.',
      ],
      [
        'ATM camera on {later}: the defendant withdraws the payment. The transaction record matches the amount and account.',
        'ATM camera on {later}: a person of the defendant’s build withdraws the payment. A hood obscures the face; the defendant had also reported their wallet missing.',
        'Bank messages: the defendant notices the unexpected payment and transfers part to the relative, keeping the rest. The defendant says the retained amount repaid an existing debt.',
      ],
    ],
    issue:
      'Follow both the false emergency claim and the money. Account ownership, SIM access, and knowing participation are separate parts of the record.',
  },
  watch_sale: {
    title: 'The counterfeit watch',
    category: 'FRAUD',
    accusation:
      'You are accused of knowingly selling a counterfeit watch as genuine at {place} on {time}, taking {amount} from the buyer.',
    evidence: [
      'Buyer’s retained messages: the seller guarantees a genuine branded watch and takes {amount}. A later examination identifies a counterfeit movement and copied serial number.',
      'Meeting video: the defendant personally hands the watch and a supposed authenticity certificate to the buyer.',
      [
        'Certificate issuer’s record: the certificate was edited on the defendant’s computer. Messages show the defendant ordering a replica with that serial number.',
        'Certificate issuer’s record: the certificate is forged. A supplier sent that same file to the defendant before the sale.',
        'Certificate issuer’s record: the certificate is forged. The defendant bought the watch second-hand with that paper already in its box.',
      ],
      [
        'Supplier messages from {previous}: the defendant acknowledges that the watch is a replica, then asks for packaging that will make it look genuine.',
        'Repair-shop email from {previous}: the shop warned the defendant that the watch might be counterfeit. The supplier then insisted it was genuine and offered a replacement certificate.',
        'Repair-shop note from {previous}: the serial number raised a concern, but the shop did not open the watch. The defendant cancelled a proposed full examination.',
      ],
      [
        'Buyer’s messages: after being shown the laboratory finding, the defendant deletes the sale listing and blocks the buyer.',
        'Buyer’s messages: the defendant insists on the supplier’s certificate and refuses a refund. The price was close to the price of a genuine used watch.',
        'Sale listing: the defendant described the watch as professionally authenticated. No completed professional examination appears in the supplied records.',
      ],
    ],
    issue:
      'The watch is counterfeit and the defendant made the sale. The question is whether the promise of authenticity was knowingly false when payment was taken.',
  },
  prize_letter: {
    title: 'The prize that did not exist',
    category: 'FRAUD',
    accusation:
      'You are accused of using a false prize notice to deceive a recipient in {place} into paying {amount} in release fees on {time}.',
    evidence: [
      'Recipient’s letter and bank receipt: the notice promises a cash prize once a release fee is paid. The recipient pays {amount}; the named lottery confirms there was no such prize.',
      [
        'Post-office camera from {previous}: the defendant sends the tracked envelope. Its tracking number matches the envelope kept by the recipient.',
        'Post-office camera from {previous}: the sender has the defendant’s build and work coat. The camera records the back of their head.',
        'Mailing receipt from {previous}: the defendant posted the envelope. The defendant says a printing customer supplied the sealed letter.',
      ],
      'Bank record: the fee enters an account held by the defendant. The letter presents it as the lottery’s payment account.',
      [
        'Computer examination on {next}: the defendant wrote the notice and saved a list of recipients. Messages discuss collecting fees despite there being no prizes.',
        'Office log: the notice was printed through the defendant’s business account. A coworker had that login and access to the company payment account.',
        'Customer messages from {previous}: the defendant agreed to print and mail prize notices. A complaint warning of fake prizes reached the defendant before this notice was sent.',
      ],
      [
        'Recipient’s call recording: the defendant’s voice matches a retained business voicemail. The caller promises that paying a second fee will release the nonexistent prize.',
        'Search on {next}: unused prize notices are on the defendant’s desk. The coworker says the defendant directed the mailing; no other witness confirms that instruction.',
        'Payment record: the defendant forwards most fees to the customer and keeps a percentage. The defendant says this was payment for mailing services.',
      ],
    ],
    issue:
      'The prize promise was false. Distinguish knowingly running or helping the scheme from providing services without knowing the letters were fraudulent.',
  },
  fake_inspector: {
    title: 'The meter inspector',
    category: 'FRAUD',
    accusation:
      'You are accused of posing as a utility inspector in {place} on {time} and taking {amount} for a repair that was not needed.',
    evidence: [
      'Resident’s door recording: a visitor claims to be sent by the utility company and demands an immediate repair payment. The resident pays; the utility confirms it sent nobody.',
      [
        'Door camera: the defendant’s face is clear while showing the badge, making the claim, and receiving the payment.',
        'Door camera: the visitor resembles the defendant and wears their company’s uniform. A cap and doorway shadow hide much of the face.',
        'Door camera: the defendant makes the visit and takes payment. The defendant says a subcontractor told them the utility had ordered the repair.',
      ],
      'Utility examination on {next}: the meter was working correctly. The visitor left a sticker but replaced no part and carried out no recorded repair.',
      [
        'Messages from {previous}: the defendant orders fake utility badges and tells an associate that residents will pay if threatened with disconnection.',
        'Uniform record: a former employee kept a uniform and payment terminal registered to the defendant’s company. Both could receive payments into its account.',
        'Subcontractor messages from {previous}: the defendant is told to collect a repair fee. A separate utility email warns the defendant that the subcontractor has no authority to represent it.',
      ],
      [
        'Bank record: the payment enters the defendant’s account. The door recording shows the defendant issue a receipt falsely naming the utility.',
        'Bank record: the payment enters the defendant’s business account. The resident recognizes the defendant in a later company photograph, after first describing only the uniform.',
        'Bank record: the defendant keeps part of the fee and sends the rest to the subcontractor. The resident’s receipt still describes the visit as an official utility repair.',
      ],
    ],
    issue:
      'A fabricated official visit caused the payment. Examine identification and what the person collecting the fee knew about the claimed utility authority.',
  },
  cinema_store: {
    title: 'The cinema storeroom fire',
    category: 'ARSON',
    accusation:
      'You are accused of deliberately starting a fire in a {place} cinema storeroom on {time}, damaging equipment and the building.',
    evidence: [
      'Fire service report: the fire starts inside the locked storeroom and spreads into the cinema corridor. Staff evacuate the building.',
      [
        'Storeroom camera: the defendant deliberately ignites a pile of packaging, watches it burn, and leaves. Their face is clear.',
        'Corridor camera: the defendant enters with a container and leaves shortly before smoke appears. The camera cannot see inside the storeroom.',
        'Corridor camera: the defendant leaves shortly before the alarm. Another staff member entered earlier; the rear service door is outside the camera view.',
      ],
      [
        'Fire examination on {next}: the burned packaging contains fuel residue. A used ignition match is recovered at its edge.',
        'Fire examination on {next}: fuel residue is found beside a failed battery charger. Heat damage prevents the examiner from determining which ignited first.',
        'Fire examination on {next}: the packaging was deliberately ignited. Damage prevents recovery of useful fingerprints from the ignition area.',
      ],
      [
        'Access record: the storeroom was empty when the defendant entered. Continuous footage shows nobody else enter before ignition.',
        'Cleaning log from {previous}: the defendant was assigned to move a container of cleaning fluid into the storeroom. The charger had overheated earlier that week.',
        'Key record: the defendant and a maintenance worker both had keys. The worker’s entry and departure were not recorded at the rear door.',
      ],
      [
        'Staff statement: the defendant had threatened to burn the equipment after dismissal. The witness saw them leave while the fire was visible.',
        'Staff statement: the defendant had threatened to burn the equipment. The defendant reported a burning smell when they left the room.',
        'Search on {next}: the defendant’s gloves have fuel residue. They also handled fuel during maintenance work that day.',
      ],
    ],
    issue:
      'Assess deliberate ignition and the actor separately. Presence with a container may have a work explanation; origin evidence and access must complete the connection.',
  },
  farm_barn: {
    title: 'The barn fire',
    category: 'ARSON',
    accusation:
      'You are accused of deliberately setting fire to stored hay at a farm near {place} on {time}, destroying the barn.',
    evidence: [
      'Fire service report: fire starts in the hay store and destroys the barn. The farmer had given nobody permission to burn its contents.',
      [
        'Yard camera: the defendant is clearly visible lighting material at the hay entrance, then stepping back as the fire spreads.',
        'Yard camera: the defendant carries a lamp into the barn. The camera sees a glow after they leave but cannot show how it started.',
        'Road witness: a person in the defendant’s farm coat walks away from the barn before the alarm. The witness sees only their back.',
      ],
      [
        'Scene examination on {next}: separate ignition points contain the same fuel residue. The electrical supply to that part of the barn had been disconnected.',
        'Scene examination on {next}: the remains of the defendant’s lamp lie near the first burned hay. The lamp’s damaged fitting could have spilled fuel if dropped.',
        'Scene examination on {next}: there are separate ignition points. A boot mark at the entrance is consistent with the defendant’s boots, a model worn by several farmworkers.',
      ],
      [
        'Full camera sequence: the defendant places the lamp down, then intentionally lights a separate trail leading into the hay.',
        'Work log: the farmer asked the defendant to check a leak in the roof. The defendant says the lamp fell while they moved wet bales.',
        'Work log: another farmworker borrowed the defendant’s coat and boots earlier that day. Their return time was not recorded.',
      ],
      [
        'Phone message from {previous}: the defendant tells the farmer that the barn will be burned in retaliation for dismissal.',
        'Farmer’s statement: the defendant had threatened to burn the barn after a pay argument. The defendant called the fire service and tried to release the livestock.',
        'Farmer’s statement: the defendant had threatened the barn and knew its layout. The other farmworker also had keys and was present that evening.',
      ],
    ],
    issue:
      'Distinguish deliberate ignition from a work accident, and general clothing or boot matches from identification of the person who lit the fire.',
  },
  garage_fire: {
    title: 'The repair garage fire',
    category: 'ARSON',
    accusation:
      'You are accused of deliberately setting fire to a customer’s car at a {place} repair garage on {time}, damaging the car and workshop.',
    evidence: [
      'Fire service and customer reports: fire begins beside the customer’s car and spreads through the workshop. The customer had left it for repairs.',
      [
        'Workshop camera: the defendant’s face is clear as they pour liquid beside the car and ignite it. The owner had refused permission to dispose of the car.',
        'Workshop camera: the defendant works beside the car shortly before the fire. A lifted bonnet hides the first flames.',
        'Workshop camera: someone in the defendant’s overalls bends beside the car. A welding curtain hides the person’s face and the ignition.',
      ],
      [
        'Fire examination on {next}: a poured fuel trail leads from the car to a used match. The electrical fault is outside the ignition area.',
        'Fire examination on {next}: fuel leaked beside a recently repaired electrical cable. Damage prevents the examiner from determining whether a spark or a separate flame started it.',
        'Fire examination on {next}: the car was deliberately ignited with poured fuel. The recovered container carries the defendant’s print.',
      ],
      [
        'Full camera sequence: the defendant removes the container from a locked cabinet and acts alone. No repair work is underway when they ignite it.',
        'Job sheet from {previous}: the defendant was assigned to fix the fuel leak. Another mechanic warned that the replacement cable might rub against the bodywork.',
        'Garage records: three mechanics used the container during repairs. A coworker borrowed the defendant’s overalls that week and had a workshop key.',
      ],
      [
        'Recorded phone call: the defendant tells the customer they will destroy the car over an unpaid bill. The call ends shortly before the filmed ignition.',
        'Recorded phone call: the defendant had threatened to destroy the car over an unpaid bill. The defendant says the repair then went wrong and calls the fire service.',
        'Customer’s statement: the defendant had threatened the car and was the last person seen near it. The camera has no view of the side entrance.',
      ],
    ],
    issue:
      'The threatened destruction supports intent, while repair records may explain presence and traces. Compare the actual ignition evidence and access.',
  },
  boat_fire: {
    title: 'The marina fire',
    category: 'ARSON',
    accusation:
      'You are accused of deliberately igniting a moored boat at the {place} marina on {time}, damaging it and a neighbouring boat.',
    evidence: [
      'Fire service report: fire starts in the boat’s cabin and spreads to the neighbouring berth. The owner had left the cabin locked.',
      [
        'Dock camera: the defendant’s face is clear as they enter the cabin, set a visible flame against the curtains, and leave.',
        'Dock camera: the defendant enters the cabin carrying a toolbox and leaves shortly before smoke appears. The cabin interior is out of view.',
        'Dock camera: a person wearing the defendant’s sailing jacket enters. Their back faces the camera and the cabin blocks the exit view.',
      ],
      [
        'Scene examination on {next}: the curtains carry poured fuel residue. The heater was switched off and disconnected before the fire.',
        'Scene examination on {next}: the first burning is beside a repaired cabin heater. Fuel residue could come from a leak or a deliberate spill; the damaged parts cannot settle which.',
        'Scene examination on {next}: a deliberate fuel trail leads to the curtains. The defendant’s print is on the cabin’s outside door handle.',
      ],
      [
        'Owner’s messages: the defendant had no permission to enter and had threatened to burn the boat after an argument.',
        'Owner’s messages from {previous}: the defendant was asked to inspect the heater. The messages also show an angry threat to damage the boat over the repair fee.',
        'Marina record from {week}: the defendant repaired the cabin door. Two other crew members held keys, and one had borrowed the sailing jacket.',
      ],
      [
        'Dock witness: the witness saw the defendant wait until flames were visible, then leave without raising the alarm. The camera confirms the sequence.',
        'Emergency call: the defendant reports smoke from the boat on {later}. The defendant says they smelled fuel before leaving but did not find a leak.',
        'Dock witness: the defendant was arguing with the owner earlier and was seen near the berth. The witness did not see who entered the cabin.',
      ],
    ],
    issue:
      'Use the origin findings to assess deliberate ignition, then connect a particular person to it. Earlier repair work can explain access and an old print.',
  },
} as const satisfies Record<string, Story>;

export type StoryKind = keyof typeof stories;
