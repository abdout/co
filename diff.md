# Complete Guide to Testing Siemens 7UT613 Differential Protection Relay with Freja 306


## What is Differential Protection?

Think of differential protection like checking water flowing through a pipe. If the same amount of water goes in one end as comes out the other end, everything is fine. But if water is leaking out somewhere in the middle, we have a problem! The differential relay compares the electricity going into and out of the transformer. If they're different (beyond what's normal), it signals an alarm.

## Our Transformer and Relay Details

- *Transformer*: This is a 33kV to 13.8kV transformer that can handle 25MVA of power
- *Connection Type*: Dy1 (Delta on high side, wye on low side, with a 30° offset)
- *Current Transformers*: These are like measuring cups that scale down the huge currents
  - High side: 800/1A (turns 800A into 1A for the relay to measure)
  - Low side: 1600/1A (turns 1600A into 1A for the relay to measure)
- *Relay*: Siemens 7UT613 with 1A nominal input

## Setting Up Your Test Equipment

### Connecting the Freja 306 Test Set

1. *Physical Connections*:
   - Connect the red, yellow, and blue cables from Freja's Channel 1 to the relay's HV current inputs
   - Connect the red, yellow, and blue cables from Freja's Channel 2 to the relay's LV current inputs
   - Connect the trip contact outputs from the relay to Freja's binary inputs
   - Make sure all connections are tight and secure

2. *Power Up*:
   - Turn on the Freja 306
   - Wait for it to boot up completely
   - Make sure the relay is also powered on

3. *Initial Settings on Freja*:
   - Set system frequency to 60Hz (our relay is set for 60Hz in setting 270)
   - Set phase rotation to L1L2L3 (as per relay setting 271)
   - Select manual test mode or differential test mode if available

## Understanding the Measurements

Before we start testing, let's understand some important numbers:

### Base Current Calculations:

For the high voltage (33kV) side:

Primary current at full load = 25,000,000 watts ÷ (1.732 × 33,000 volts) = 437.4 amps
Secondary current (what the relay sees) = 437.4 amps ÷ 800 = 0.547 amps


For the low voltage (13.8kV) side:

Primary current at full load = 25,000,000 watts ÷ (1.732 × 13,800 volts) = 1,046.6 amps
Secondary current (what the relay sees) = 1,046.6 amps ÷ 1600 = 0.654 amps


The relay will handle these different currents and make its decisions.

## Test 1: Basic Differential Pickup Test

### What We're Testing
We want to check if the relay detects a small problem current (called differential current) when it reaches 0.3 times the rated current (setting 1221).

### Simple Explanation
Imagine two water faucets. One represents current flowing into the transformer, the other represents current flowing out. Normally they should be equal. We'll keep one steady and reduce the other slightly until the relay notices the difference.

### Step-by-Step Instructions

1. *Set Up on Freja*:
   - Go to the manual injection mode
   - Set up phase angles for proper vector group compensation:
     - High side: A phase = 0°, B phase = 240°, C phase = 120°
     - Low side: A phase = 330°, B phase = 210°, C phase = 90°
   - These angles account for the transformer's Dy1 connection

2. *Start with Balanced Current*:
   - Set the Freja to inject exactly the same current on both sides
   
   High side: Set all three phases to 0.5 amps at the angles above
   Low side: Set all three phases to 0.5 amps at the angles above
   
   - At this point, the relay should see equal currents (balanced) and NOT trip

3. *Create Imbalance Step-by-Step*:
   - Keep the high side currents steady at 0.5 amps
   - Start reducing the low side currents in small steps:
     - First try 0.4 amps (difference = 0.1 amps)
     - Then try 0.3 amps (difference = 0.2 amps)
     - Then try 0.2 amps (difference = 0.3 amps)
     - Finally try 0.15 amps (difference = 0.35 amps)

4. *Watch for the Trip*:
   - The relay should trip when the difference (0.5 - 0.2 = 0.3 amps) equals 30% of nominal current (setting 1221)
   - Record exactly when the trip happens

5. *Verify Trip Time*:
   - The trip should happen almost instantly (setting 1226A is 0.00 seconds)

## Test 2: High-Set Differential Element Test

### What We're Testing
We're checking if the relay responds quickly to large problems (setting 1231 = 8 times nominal current).

### Simple Explanation
This is like checking if a smoke alarm responds to a lot of smoke. We'll create a big difference in current to see if the relay trips immediately.

### Step-by-Step Instructions

1. *Method 1 - Direct Injection*:
   - Put current only into the high side
   
   High side: Set all three phases to 8 amps
   Low side: Set all three phases to 0 amps
   
   - The relay should immediately trip

2. *Method 2 - Opposing Currents* (if you prefer):
   - Put currents flowing in opposite directions
   
   High side: Set all three phases to 4 amps at normal angles
   Low side: Set all three phases to 4 amps, but reversed (add 180° to each angle)
   
   - This creates 8 amps of differential current

3. *Verify Trip Time*:
   - The trip should be instantaneous (setting 1236A is 0.00 seconds)

## Test 3: Detailed Slope Characteristic Test

### What We're Testing
We're testing how the relay responds to different combinations of through-current and differential current.

### Simple Explanation
Imagine a hill with two different steepnesses. When a small amount of water flows through our pipe (low restraint), we're very sensitive to leaks. When lots of water flows through (high restraint), we allow a bit more leakage before alarming. The "slope" is like the steepness of this hill.

### Understanding the Slope Settings
- *Slope 1* = 0.25 (25%) from 0 up to 2.5 times nominal current
- *Slope 2* = 0.50 (50%) above 2.5 times nominal current

This means:
- At low currents: We allow differential current up to 25% of restraint current
- At high currents: We allow differential current up to 50% of (restraint current - 2.5) + the amount at the breakpoint

### Step-by-Step Instructions for Understanding and Testing the Slopes

1. *Understanding the Math*:
   - Restraint current = (|High side current| + |Low side current|) ÷ 2
   - Differential current = |High side current - Low side current|
   - For Slope 1 (below 2.5 I/InO): Maximum allowed differential = 0.25 × restraint
   - For Slope 2 (above 2.5 I/InO): Maximum allowed differential = 0.625 + 0.50 × (restraint - 2.5)

2. *Test Point 1 - Low Restraint Region*:
   - We'll test the first slope with restraint current = 1 times nominal
   - Maximum differential without trip = 0.25 × 1 = 0.25 times nominal
   - We'll inject slightly more to cause a trip:
   
   High side: Set all three phases to 1.15 amps at proper angles
   Low side: Set all three phases to 0.85 amps at proper angles
   
   - This gives:
     - Restraint current = (1.15 + 0.85) ÷ 2 = 1 times nominal
     - Differential current = |1.15 - 0.85| = 0.3 times nominal
   - Since 0.3 > 0.25, the relay should trip

3. *Test Point 2 - Near Breakpoint*:
   - We'll test near where the slope changes (2.5 times nominal)
   - Maximum differential without trip = 0.25 × 2.5 = 0.625 times nominal
   - We'll inject:
   
   High side: Set all three phases to 2.9 amps at proper angles
   Low side: Set all three phases to 2.1 amps at proper angles
   
   - This gives:
     - Restraint current = (2.9 + 2.1) ÷ 2 = 2.5 times nominal
     - Differential current = |2.9 - 2.1| = 0.8 times nominal
   - Since 0.8 > 0.625, the relay should trip

4. *Test Point 3 - High Restraint Region*:
   - We'll test the second slope with restraint current = 4 times nominal
   - Calculation for maximum differential allowed:
     - Base differential at breakpoint = 0.625
     - Additional differential allowed = 0.5 × (4 - 2.5) = 0.75
     - Total allowed = 0.625 + 0.75 = 1.375 times nominal
   - We'll inject:
   
   High side: Set all three phases to 4.7 amps at proper angles
   Low side: Set all three phases to 3.3 amps at proper angles
   
   - This gives:
     - Restraint current = (4.7 + 3.3) ÷ 2 = 4 times nominal
     - Differential current = |4.7 - 3.3| = 1.4 times nominal
   - Since 1.4 > 1.375, the relay should trip

5. *Visual Verification*:
   - Draw a simple graph with:
     - X axis = restraint current
     - Y axis = differential current
   - Plot the three test points
   - Connect the dots - you should see the dual-slope characteristic!

## Test 4: Harmonic Restraint Testing

### What We're Testing
We're testing if the relay can ignore false alarms caused by transformer inrush (2nd harmonic) and overexcitation (5th harmonic).

### Simple Explanation
When transformers first turn on or get too much voltage, they create special current patterns with extra frequencies. The relay needs to recognize these patterns and not trip unnecessarily.

### Testing 2nd Harmonic Restraint (Inrush)

1. *Set Up Differential Current First*:
   
   High side: Set all three phases to 0.6 amps (fundamental frequency only)
   Low side: Set all three phases to 0 amps
   
   - This creates 0.6 amps differential current, which is above the pickup threshold of 0.3

2. *Add 2nd Harmonic*:
   - On the Freja, add 2nd harmonic (120Hz) component to the high side currents
   
   High side: Keep fundamental at 0.6 amps, add 0.1 amps of 2nd harmonic
   
   - This creates 16.7% 2nd harmonic (0.1 ÷ 0.6 = 0.167 or 16.7%)
   - Since 16.7% > 15% threshold (setting 1271), the relay should NOT trip

3. *Reduce 2nd Harmonic*:
   
   High side: Keep fundamental at 0.6 amps, reduce 2nd harmonic to 0.08 amps
   
   - This creates 13.3% 2nd harmonic (0.08 ÷ 0.6 = 0.133 or 13.3%)
   - Since 13.3% < 15% threshold, the relay should now trip

### Testing 5th Harmonic Restraint (Overexcitation)

1. *Set Up Differential Current Again*:
   
   High side: Set all three phases to 0.6 amps (fundamental frequency only)
   Low side: Set all three phases to 0 amps
   

2. *Add 5th Harmonic*:
   - On the Freja, add 5th harmonic (300Hz) component to the high side currents
   
   High side: Keep fundamental at 0.6 amps, add 0.2 amps of 5th harmonic
   
   - This creates 33.3% 5th harmonic (0.2 ÷ 0.6 = 0.333 or 33.3%)
   - Since 33.3% > 30% threshold (setting 1276), the relay should NOT trip

3. *Reduce 5th Harmonic*:
   
   High side: Keep fundamental at 0.6 amps, reduce 5th harmonic to 0.17 amps
   
   - This creates 28.3% 5th harmonic (0.17 ÷ 0.6 = 0.283 or 28.3%)
   - Since 28.3% < 30% threshold, the relay should now trip

## Test 5: Add-On Stabilization Test

### What We're Testing
We're testing if the relay becomes more tolerant to differential current during very high through-fault conditions.

### Simple Explanation
When extremely high currents flow through the transformer (like during external faults), current transformers can become confused and give slightly wrong readings. The relay has a special mode to prevent false trips during these conditions.

### Step-by-Step Instructions

1. *Test Below Add-On Stabilization Threshold*:
   - First, create a moderate through-fault current:
   
   High side: Set all three phases to 4.4 amps at proper angles
   Low side: Set all three phases to 4.4 amps at proper angles
   
   - The relay should be stable (no trip)
   
   - Then create a small differential current by reducing low side:
   
   High side: Keep at 4.4 amps
   Low side: Reduce to 3.9 amps
   
   - This gives:
     - Restraint current = (4.4 + 3.9) ÷ 2 = 4.15 times nominal
     - Differential current = |4.4 - 3.9| = 0.5 times nominal
   - Based on the slope characteristic, this should be just enough to cause a trip

2. *Test Above Add-On Stabilization Threshold*:
   - Create a high through-fault current (above 9 times nominal, setting 1261A):
   
   High side: Set all three phases to 9.5 amps at proper angles
   Low side: Set all three phases to 9.5 amps at proper angles
   
   - The relay should be stable (no trip)
   
   - Then create a proportionally similar differential current:
   
   High side: Keep at 9.5 amps
   Low side: Reduce to 8.4 amps
   
   - This gives:
     - Restraint current = (9.5 + 8.4) ÷ 2 = 8.95 times nominal
     - Differential current = |9.5 - 8.4| = 1.1 times nominal
   - Even though this is above the normal slope characteristic, the relay should NOT trip due to add-on stabilization

## Test 6: Through-Fault Stability Test

### What We're Testing
We're checking that the relay stays stable during external faults when high currents flow through the transformer.

### Simple Explanation
We want to make sure our relay doesn't mistakenly trip for problems outside the transformer. We'll simulate high current flowing through the transformer (entering one side and exiting the other) to make sure the relay stays quiet.

### Step-by-Step Instructions

1. *Set Up Balanced Through-Fault*:
   - Remember to account for the Dy1 vector group (30° phase shift):
   
   High side: Set A=5A∠0°, B=5A∠240°, C=5A∠120°
   Low side: Set A=5A∠330°, B=5A∠210°, C=5A∠90°
   
   - The relay should remain stable (no trip)

2. *Increase Through-Fault Magnitude*:
   - Try a higher current value:
   
   High side: Set A=8A∠0°, B=8A∠240°, C=8A∠120°
   Low side: Set A=8A∠330°, B=8A∠210°, C=8A∠90°
   
   - The relay should still remain stable (no trip)

3. *Test Different Fault Types*:
   - Try a single-phase through-fault:
   
   High side: Set A=5A∠0°, B=0A, C=0A
   Low side: Set A=5A∠330°, B=0A, C=0A
   
   - The relay should remain stable (no trip)

## Test 7: Vector Group Compensation Test

### What We're Testing
We're checking if the relay correctly handles the 30° phase shift due to the transformer's Dy1 connection.

### Simple Explanation
Transformers can shift the timing of electrical waves. Our transformer shifts them by 30°. The relay needs to account for this shift to work properly. We'll test both correct and incorrect compensation.

### Step-by-Step Instructions

1. *Correct Vector Group Test*:
   - Inject currents with proper phase shift:
   
   High side: Set A=2A∠0°, B=2A∠240°, C=2A∠120° (Delta)
   Low side: Set A=2A∠330°, B=2A∠210°, C=2A∠90° (Wye with 30° shift)
   
   - The relay should see this as balanced current and NOT trip

2. *Incorrect Vector Group Test*:
   - Inject currents with improper phase shift:
   
   High side: Set A=2A∠0°, B=2A∠240°, C=2A∠120° (Delta)
   Low side: Set A=2A∠0°, B=2A∠240°, C=2A∠120° (no shift)
   
   - The relay should see this as unbalanced and TRIP

## Visual Aids for Understanding the Tests

### Slope Characteristic Diagram


Differential Current (I-DIFF)
^
|                                  /
|                                /
|                              /
|                            /_____ Slope 2 (0.5)
|                          /
|                        /
|                      /
|                    /_______ Slope 1 (0.25)
|                  /
|                /
|              /
|            /
|          /
|        /
|      /
+-----+-----------------------------> Restraint Current
     0   1   2   2.5  3   4   5


### Vector Diagram for Dy1 Transformer


     HIGH SIDE (DELTA)          LOW SIDE (WYE)
         Ia (0°)                  Ia (330°)
          ^                         ^
          |                        /
          |                       /
          |                      /
          |                     /
          +------>              +------>
         Ic      Ib            Ic      Ib
       (120°)  (240°)        (90°)   (210°)


## Practical Tips for Manual Testing with Freja 306

1. *Start Simple*:
   - Begin with the basic differential pickup test to make sure everything is connected properly
   - Only move to more complex tests once basic operation is confirmed

2. *Be Methodical*:
   - Record all test values and results
   - Take notes of any unexpected behavior
   - Double-check your calculations before testing

3. *Using Freja 306 without Software*:
   - Use the rotary knob to navigate menus
   - Use "CONFIG" to set up general parameters
   - Use "MANUAL" mode for basic testing
   - For harmonic testing, you'll need to use the dedicated harmonic settings

4. *Testing with Harmonics*:
   - On Freja 306, look for "Harmonics" or "Wave Shape" in the menus
   - You may need to set the percentage of harmonics relative to fundamental
   - Make sure you're injecting harmonics on the correct phases

5. *Binary Outputs*:
   - Connect relay trip contacts to Freja binary inputs
   - Set Freja to monitor these inputs during testing
   - Verify that:
     - Both B413 and 13.8kV circuit breakers receive trip signals
     - Trip signals last at least 0.15 seconds (setting 851A)

## Final Testing Checklist

Use this checklist to make sure you've completed all tests:

- [ ] Differential Pickup (I-DIFF>)
- [ ] High-Set Differential (I-DIFF>>)
- [ ] Restraint Characteristic (Slope 1 region)
- [ ] Restraint Characteristic (Breakpoint)
- [ ] Restraint Characteristic (Slope 2 region)
- [ ] 2nd Harmonic Restraint
- [ ] 5th Harmonic Restraint
- [ ] Add-On Stabilization
- [ ] Through-Fault Stability
- [ ] Vector Group Compensation

## Troubleshooting Common Issues

1. *Relay Doesn't Trip When Expected*:
   - Check all connections
   - Verify Freja is outputting the expected currents
   - Double-check your angle calculations
   - Verify relay settings match your documentation

2. *Relay Trips When It Shouldn't*:
   - Check for proper phase angle compensation
   - Verify harmonic content is being correctly injected
   - Ensure Freja is properly synchronized

3. *Unstable or Flickering Trip Outputs*:
   - Check for loose connections
   - Look for ground loops
   - Increase test current slightly to move away from boundary conditions

## Summary Table of Key Test Points

| Test Type | High Side Current | Low Side Current | Expected Result |
|-----------|-------------------|------------------|-----------------|
| Pickup | 0.5A | 0.2A | TRIP |
| High-Set | 8A | 0A | TRIP |
| Slope 1 | 1.15A | 0.85A | TRIP |
| Breakpoint | 2.9A | 2.1A | TRIP |
| Slope 2 | 4.7A | 3.3A | TRIP |
| 2nd Harmonic | 0.6A + 0.1A (120Hz) | 0A | NO TRIP |
| 5th Harmonic | 0.6A + 0.2A (300Hz) | 0A | NO TRIP |
| Add-On Stability | 9.5A | 8.4A | NO TRIP |
| Through-Fault | 5A | 5A (with 30° shift) | NO TRIP |
| Vector Group | 2A | 2A (with NO shift) | TRIP |

Remember, the purpose of all these tests is to make sure the relay will protect the transformer when there's a real problem inside it, but won't unnecessarily trip for normal conditions or problems outside the transformer. By methodically working through these tests, you're ensuring the power system remains reliable and protected!