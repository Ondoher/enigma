<div  style="text-align: right">
    <img src="./enigma-toolkit-logo.png" height="100"/>
</div>

# Table of Contents
[Getting Started](#getting-started)

[Simulation](#simulation)
- [Events](#events)
- [Plugboard](#plugboard)
- [Rotor](#rotor)
- [Reflector](#reflector)
- [Enigma](#enigma)
- [Example](#example)

[Generation](#generation)
- [Random](#random)
- [Generator](#generator)
- [CodeBook](#codebook)

# Getting Started

To install the toolkit, use the command:

```npm install @ondoher/enigma```

You can then import this into your code like this:

```JavaScript
import {Enigma} from '@ondoher/enigma';

let enigma = new Enigma("I", {reflector: 'B'});
```

In addition to this api, there is also [documentation](https://github.com/Ondoher/enigma/blob/main/docs/enigma.md)
that gives a brief overview of what the Enigma is, and some technical details
about its operation. Following that is a detailed breakdown of how to go about
writing a simulation and all of the small details and quirks that will need to
be accounted for. And there are many.

The API is broken into two main parts, the simulator and the message generator.
With the simulator you can construct an entire Enigma, or just create instances
of the individual components. This API is provided as a working reference that
can be used to validate the simulator being built. You can match the input and
output of your simulation against the reference implementation to locate
failures to be corrected. The API also provides a way to hook into the various
stages of encoding to observe the transformation of state and data as it occurs.

# Simulation

## Events
Each class below, except Inventory, has a method named `listen`. Call this
method to pass a function that will be called when significant events happen to
the class instance. When creating an instance of the Enigma, this callback
will be passed to every constructed component.

The signature of this callback should look like this:

---
`function (event, name, data)`

#### **Parameters**
- **event** - which event is being fired.
- **name** - the name of the component that has fired this event
- **data** - an object that contains information relevant to the event

### **Event Types**
There are five different events, they are.
- **input** - fired when any component receives a signal
- **output** - fired when any component sends a signal
- **translate** - fired when a component outputs a signal, contains information
about both the input and the output
- **step** - fired when a rotor steps
- **double-step** - fired when a rotor performs the double step.

### Common

Every event contains these parameters,

- **name** - contains the name of the component sending the event
- **type** - the type of component sending the event. This is one of *Entry Wheel*,
    *Plugboard*, *Reflector*, *Rotor* and *Enigma*
- **description** - a human readable string that details the event
- **direction** - this is not sent for all events, but is for *input*, *output*,
and *translate*, it is one of:

    - **right** - this is the direction the translation starts until it hits
    the reflector
    - **left** - this is the direction translation happens after going through
    the reflector.
    - **turn-around** - sent by the reflector
    - **end-to-end** - sent by the Enigma


### input
This event is fired when any component receives a signal. In addition to the
common fields, the data object contains these fields:

- **input** - this is the input value, it can be either a string or a number

### output

This event is fired sent when any component sends a signal. In addition to the
common fields, the data object contains these fields:

- **output** - this is the output value, it can be either a string or a number

### translate

This event is fired when a component outputs a signal, contains information
about both the input and the output. In addition to the common fields, the data
object contains these fields:

- **input** - this is the input value, it can be either a string or a number
- **output** - this is the output value, it can be either a string or a number

### step

This event is fired when a rotor steps. In addition to the common fields, the
data object contains these fields:

- **start** - the staring position of the rotor
- **stop** - the ending position of the rotor
- **turnover** - true if the the stepping reached the turnover point

The specific events and data are defined in the class documentation that
follows.

### double-step

This event is fired when a rotor performs the double step. In addition to the
common fields, the data object contains these fields:

- **offset** - the new position of the rotor

## PlugBoard
Create an instance of this class to simulate the plug board component of an
Enigma.

### **Methods**

---
`constructor(name, settings)`

This is the constructor for the plugboard class. It takes these parameters:

#### **Parameters**
- **name** each encoder component in the system has a name. There is only one
plug board in the Enigma, so the name here doesn't really matter
- **settings**
    - _alphabet_ (optional) set this to a string of letters that are an
    alternative to the standard A-Z. Defaults to A-Z
    - _map_ (optional) set this to a string that will set the mapping between
    the position in the string to the output connector. Defaults to A-Z

---
`configure(settings)`

Call this method to configure the plug board. This must be called even if there
are no plug connections.

#### **Parameters**
- **settings** these are the settings to configure the plug board.
    - _plugs_ (optional) either an array of strings or a single string. If it
    is a string, it must be a space separated list of letter pairs that
    connects one input letter to another. If it is an array then then each item
    is a pair of letters to specify how the plugs are connected

---
`encode(direction, input)`

Call this method to encode a value in the given direction, right vs left.

#### **Parameters**
- **direction** `right` when moving towards the reflector `left` when moving
    back
- **input** this is the input connector.

#### **Returns**
the output connector

## Rotor

Create an instance of this class to construct a Rotor object. The Rotor class
encapsulates many of the peculiar behaviors of the Enigma. All connector values
here are specified in physical space. See the [documentation](./docs/enigma.md)
for an explanation.

### **Methods**

---
`constructor(name, settings)`

#### **Parameters**
- **name** the name of the rotor; under normal circumstances this will be the
    string 'rotor-' plus the standard name for the rotor, for example 'rotor-IV'
- **settings** an object that contains the various options that define the
    the rotor and how it is configured.
    - _alphabet_ (optional) set this to a string of letters that are an
    alternative to the standard A-Z. Defaults to A-Z
    - _map_ a string that defines the mapping between the input and output
    connectors. The index into the string is the input connector and the value
    of this string at that index is the output connector. For example
    'EKMFLGDQVZNTOWYHXUSPAIBRCJ', which is the map for standard rotor I
    - _ringSetting_ a number that specifies how far forward to offset the
    outer ring relative to the internal wiring.
    - _turnovers_ a string that specifies the relative location of where on the
    rotor turnover will occur. The value here is the rotation value would be
    displayed in the window when turnover happens, expressed as a character.
    The standard rotors VI-VIII, available in the later model M3 had two
    turnover locations, M and Z. Pass an empty string when the rotor does not
    rotate during stepping

---
`setStartPosition(connector)`

Call this method to set the starting rotation for encoding.

#### **Parameters**
- **connector** This is a letter value that corresponds to what would appear in
the rotation window. This value will be adjusted for the ring setting.

---
`encode(direction, input)`

Call this method to map an input connector to an output connector when the
signal is moving in the given direction. The input connector represents a
physical location in real space. To get the logical connector for the rotor's
zero point we need to adjust the connector number for the current rotation.

#### **Parameters**
- **direction** `right` when moving towards the reflector `left` when moving
    back
- **input** the input connector given in physical space.

#### **Returns**
the output connector in physical space

---
`step()`

Call this method to step the rotor

#### **Returns**
true if the next rotor should be stepped

---
`willTurnover()`
Call this method to see if the next step on this rotor will lead to turn over.
The Enigma class will call this on the middle rotor to handle double stepping.

#### **Returns**
true if the next step will cause turnover

---
`isFixed()`

Call this method to find whether this is a fixed rotor.

#### **Returns**
True if this is a fixed rotor.

### **Events**

`encode-right, encode-left`

These events will be fired during encoding. The info object will contain these
members

- **input** the physical input connector
- **output** the physical output connector
- **logicalInput** the logical connector that receives input. This value is
    always relative to the internal wiring.
- **logicalOutput** the logical connector that gets the output.
- **rotation** current rotation offset

`step`

This event will be fired every time a rotor is stepped. The info object will
contain these members

#### **Parameters**
- **rotation** the current rotation offset
- **ringSetting** the configured ringSetting for this rotor.
- **turnover** true if the next rotor should be stepped

## Reflector
Create an instance of this class to construct a reflector class. Unlike most
other encoders, the reflector only has a single set of connectors. Input and
output happen on the same connectors, with pairs of them linked. Because of
this, reflectors only encode in a single direction.

### **Methods**

---
`constructor(name, settings)`

#### **Parameters**
- **name** the name of the reflector, under normal circumstances this be the
    string 'reflector-' plus the standard name for the reflector, for example
    'reflector-C'
- **settings** an object that contains the various options that define the
    the reflector and how it is setup.
    - _alphabet_ (optional) set this to a string of letters that are an
    alternative to the standard A-Z. Defaults to A-Z
    - _map_ a string that defines the mapping between the input and output
    connectors. The index into the string is the input connector and the value
    of this string at that index is the output connector. For example,
    'YRUHQSLDPXNGOKMIEBFZCWVJAT' which is the map for standard reflector B.

---
`encode(direction, input)`

Call this method to encode a value when reversing the encoding direction of the
Enigma. As the point where direction changes this does not have a distinction
between a left and right signal path.

#### **Parameters**
- **direction** since this the point where signal direction changes from right
    to left this parameter is not used.
- **input** this is the input connector

#### **Returns**
the output connector

## Enigma

Create an instance of this class to construct a full Enigma.

### **Methods**

---
`constructor(settings)`

The constructor for the Enigma.

#### **Parameters**
- **settings** The settings here are for the nonconfigurable options of the
    device.
    - _alphabet_ (optional) set this to a string of letters that are an
    alternative to the standard A-Z. Defaults to A-Z
    - _entryDisk_ (optional) the name of entry disc in the inventory this
    defaults to 'default'
    - _reflector_ for the Enigma I or M3 this specifies one of three possible
    standard reflectors from the inventory which are A, B, and C. For the M4,
    Thin-B and Thin-C have been defined.

---
`configure(settings)`

Call this method to configure the enigma instance for daily setup.

#### **Parameters**
- **settings** the configuration parameters for the device.
    - _plugs_ (optional) this specifies how the plug board should be configured.
    This is either a string with the plugs specified as pairs of letters
    separated by a single space, or an array of letter pairs.
    - _rotors_ this is an array of strings that specifies which rotors should be
    installed on the device and in which order. These rotors have been
    predefined: I-V for the model I, VI-VIII are added for the Model M3, and
    Beta and Gamma are the fixed rotors for the M4. The order here is
    significant and is given in the left to right direction. This means that
    last name in this list is the first rotor used in the forward direction and
    last used in the backward direction. Each element is the name of the rotor
    to use in the corresponding position. Stepping stops at the first fixed
    rotor.
    - _ringSettings_ (optional) This is either a string, or an array of
    numbers. The index of each letter in the alphabet, or the number in the
    array, is the ring setting for a rotor. Like the rotors, these are given
    from left to right.

---
`step()`

Call this method to step the Enigma. This will rotate the first rotor to the
right and step and double step when necessary.

---
`setStart(start)`

#### **Parameters**
- **start** this is either a string or an array of numbers. The length of the
    string or the array should match the number of rotors and are given left to
    right. If start is a string then the letters of the string specify the start
    value seen in the window for the corresponding rotor. If it is an array then
    each number will be the one-based rotation value.

---
`keyPress(letter)`

Call this method to encode a single letter. This will step the Enigma before
encoding the letter.

#### **Parameters**
- **letter** this method will force the letter parameter to uppercase. If it is
    anything except a member of the given alphabet it will return undefined. For
    any other character except a space it will also output a warning to the
    console.

#### **Returns**
undefined or the encoded character.

---
`translate(start, text)`

Call this method to encode a whole string.

#### **Parameters**
- **start** the start positions for the rotors. This parameter is the same as
    what's passed to `setStart`.
- **text** This is the string to be encoded. Any characters in this string that
    are not part of the defined alphabet are ignored.

#### **Returns**
the encoded string. Passing the result of this method back through the encode
    method should produce the original text.

## **Properties**

`configuration`
Use this property to get all the information necessary to reconstruct the
details on this Enigma. It is an object with these fields:

- **rotors** - this list of rotor names
- **ringSettings** - an array of ring settings for each rotor
- **plugs** - a space separated string of plug pairs
- **reflector** - the installed reflector

---
`rotors`
An array of the installed rotors


## **Example**

```javascript
import {Enigma} from '@ondoher/enigma';

let enigma = new Enigma("I", {reflector: 'B'});

enigma.configure({
    rotors: ['III', 'VI', 'VIII'],
    ringSettings: [1, 8, 13],
    plugs: 'AN EZ HK IJ LR MQ OT PV SW UX'
});

let message = 'YKAENZAPMSCHZBFOCUVMRMDPYCOFHADZIZMEFXTHFLOLPZLFGGBOTGOXGRETDWTJIQHLMXVJWKZUASTR'
let decoded = enigma.translate('UZV', message)

console.log(decoded)

//STEUEREJTANAFJORDJANSTANDORTQUAAACCCVIERNEUNNEUNZWOFAHRTZWONULSMXXSCHARNHORSTHCO
```

## Inventory

The inventory class is used to save named definitions of different components
that can be used by the Enigma. The module doesn't export the class, but instead
exports an instance of it named `inventory`. Components that have been added to
this inventory can be passed to the Enigma for configuration. By default the
following components are already defined:

- **Rotors** I, II, III, IV, V, VI, VII, VI, Beta, and Gamma. VI, VII, and VIII
    are used in the M3 and M4 and have two turnover points. The last two are
    fixed rotors used in the M4.
- **Reflectors** A, B, C, Thin-B, and Thin-C. Those last two are the thin
    reflectors used in the M4.
- **EntryDisc** the system only defines one entry disk, named default. It's just
    a simple pass through.

### **Methods**

---
`addRotor(name, map, turnovers)`

Call this method to add a new rotor definition.

#### **Parameters**
- **name** the name of the rotor being added. This name will be used when
    specifying the rotors to use for the Enigma configuration.
- **map** a string specifying the connector mapping. The index of the string is
    the logical coordinate of the connector, the character at that index is the
    output connector. To be exact, it would be the position of that character in
    the given alphabet. So, in the map 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', input
    connector 0 would map to output connector 4 and input connector 1 would map
    to output connector 10. Remember that the connectors are numbered starting
    at 0.
- **turnovers** this is a string of characters representing the turnover
    location on the disk. This letter would be the value shown in the window to
    the operator. In Rotor I this is 'Q' in rotors VI, VII, and VIII there are
    two turnover locations, 'M' and 'Z'. Pass an empty string if this is a fixed
    rotor

---
`addReflector(name, map)`

Call this method to add a new reflector definition.

#### **Parameters**
- **name** this is the name that will be used to reference this reflector when
    constructing an Enigma class.
- **map** this uses the same format used in the `addRotor` method

---
`addEntryDisc(name, map)`

Call this method to add a new entry disc. There was only one used in the
standard military models, but there were other versions that defined it
differently.

#### **Parameters**
- **name** this is the name that will be used to reference this entry disc when
    constructing an Enigma class.
- **map** this uses the same format used in the `addRotor` method

---
`getRotor(name)`

Call this method to get the setup for a defined rotor.

#### **Parameters**
- **name** the name of the rotor as it was added to the inventory.

#### **Returns**
an object with these fields
- **map** the connection map for the rotor
- **turnovers** the locations where turnovers happen

---
`getReflector(name)`

Call this method to get the setup for a defined reflector.

#### **Parameters**
- **name** the name of the reflector as it was added to the inventory.

#### **Returns**
an object with these fields
- **map** the connection map for the reflector

---
`getEntryDisc(name)`

Call this method to get the setup for a defined entry disc.

#### **Parameters**
- **name** the name of the entry disk as it was added to the inventory.

#### **Returns**
an object with these fields
- **map** the connection map for the entry disc

# Generation
The toolkit has the ability to generate random data that comes in two forms. The
first is the configuration of an Enigma and the generation of encrypted messages.
The second is the generation and use of message code books, specifically the
creation of key sheets and generation of messages using those key sheets. This
is implemented across three classes.

- **Random** - Umplements a seedable pseudo-random number generator. The use of
    seeds allows running experiments on a predictable set of pseudo-random data
- **Generator** - Use this to create random configurations of an Enigma and
generate messages for that configuration.
- **CodeBook** - Use this to generate random key sheets and generate messages
using that key sheet

## Random

A single instance of this class is the default export of the Random module. Use
this to generate pseudorandom numbers and perform randomization operations on
lists of items. This class uses a seedable pseudorandom number generator, this
enables the predictable generation of set of operations to reproduce the same
results.

### **Methods**

---
`randomize(seed)`

Call this method to set the random seed for the randomizer. Setting the seed
to a known value will cause to randomizer to output the same sequence of random
values. On creation the seed is set to `Date.now()`

#### **Parameters**
- **seed** - the new seed number

---
`random(limit)`

Call this method to generate a new random number. If a limit is provided the
output will be a random number between 0 and limit-1. If not, the result will be
a decimal number between 0 and 1

#### **Parameters**
- **limit** (optional) - if provided the output will be an integer value less
than this

#### **Returns**
The pseudo-random number

---
`randomCurve(dice, faces, zeroBased)`

Call this to generate a random number that is distributed along a bell curve.
This is done by generating a set of random numbers each within a limit, and
adding them together.

#### **Parameters**
- **dice** - the number of random numbers that should be chosen
- **faces** - the range of integer values
- **zeroBased** - if true the random numbers will start at 0, defaults to false

#### **Result**
The integer result

---
`pickOne(list)`

Call this method to pick a random element from the provided array. The item will
be removed from this array. Use this method if you want to prevent the same item
from being used more than once.

#### **Parameters**
- **list** - an array if items to choose from.

#### **Returns**
The array element

---
`pickPair(list)`

Call this method to pick two items from the provided array. The items will be
removed from the array. If the array is less than two items then it will return
either an empty array or an array with one element.

#### **Parameters**
- **list** - an array if items to choose from.

#### **Returns**
An array with the picked elements

---
`pickPairs(count, list)`

Call this method to pick a list of item pairs from a list of items. The items
are removed from the list as chosen.

#### **Parameters**
- **count** - how many item pairs to pick
- **list** - an array if items to choose from.

#### **Returns**
An array of item pairs

---
`pick(count, list)`

Call this method to pick a specified number of items from the list. The items
will be removed. It will return at most `list.length` elements.

#### **Parameters**
- **count** - how many items to pick
- **list** - an array if items to choose from.

#### **Returns**
An array with the chosen elements

---
`chooseOne(list)`

Call this method to pick a random element from the provided array. The item will
remain in the list.

#### **Parameters**
- **list** - an array of items to choose from.

#### **Returns**
The array element

---
`choosePair(list)`

Call this method to choose two items from the list, the elements will not be
removed. The returned items are guaranteed be different. If the array is less
than two elements it will be returned as the result

#### **Parameters**
- **list** - an array if items to choose from.

#### **Returns**
An array with the chosen elements

---
`chooseRange(count, list)`

Call this method to pick a contiguous list of items from the given list. The
items will remain in the list.

#### **Parameters**
- **count** - how many items in the range
- **list** - an array if items to choose from.

#### **Returns**
An array with the chosen elements

---
`choose(count, list)`

Call this method to choose a specified number if items from the list. The items
will not be removed. It may return the same item multiple times.

#### **Parameters**
- **count** - how many items to choose
- **list** - an array if items to choose from.

#### **Returns**
An array with the chosen elements

---

## Generator

Use the generator class to generate random enigma machine configurations and use these to generate random messages.

### **Methods**

`cleanMessage(text)`

Call this method to prepare the string for encoding. The string will be converted to uppercase and remove any characters not within A-Z

#### **Parameters**
- **text** - the text to clean

#### **Returns**
The cleaned up text

`groupText(text, size)`

Call this method to break the given text into groups of a given size,
separated by spaces.

#### **Parameters**
- **text** - the text to group
- **size** (optional) - the size of the groups, defaults to 5

#### **Returns**
The grouped text as a string

---
`generateSentences(count)`

Call this method to generate an array of random sentences. These sentences will be a contiguous list of lines from Hamlet.

#### **Parameters**
- **count** - the number of sentences to generate

#### **Returns**
An array of sentences

---
`getModelOptions(model)`

Call this method to get the range of setup and configuration options for
a specific Enigma model. The supported models are *I, M3 and M4*

#### Parameters
- **model** - the model of Enigma to use

#### Returns

An object with these fields

- **reflectors** - The names of the possible reflectors installed for this model.
- **rotors** - The names of the rotors available for this model
- **fixed** - the possible fixed rotors for this model

---
`generateEnigmaConfiguration(setup)`

Call this method to get a random configuration for an enigma.

#### **Paramters**
- **setup** - the options for configuration with these fields
    - **rotors** (optional) - the list of rotors to choose from. Defaults to
    the list of unfixed rotors in the inventory
    - **fixed** (optional) - if true, it defaults to the list of installed fixed
    rotors, if an array, uses this array as the list of fixed rotors to choose
    from. The default is an empty array.

#### **Returns**
An object with these fields>
- **rotors** - the rotors to install
- **plugs** - the plug board configuration as a string if space separated pairs
- **ringSettings** - an array of numbers for the ring setting for each rotor

---
`createRandomEnigma(model, reflectors)`

Call this method to create a new Enigma object, with a reflector chosen from the
given list.

#### **Parameters**
- **model** (optional) - the model of the Enigma, defaults to the string "Enigma"
- **reflectors** (optional) - the possible reflectors, defaults to [A, B, C]

#### **Returns**
- a newly created `Enigma` instance

---
`generateMessage(enigma)`

Call this method to create and encrypt a random message using the given Enigma.
The text of the message will be between 2 and 5 sentences from Hamlet.

#### **Parameters**

- **enigma** the `Enigma` instance to use

#### **Returns**
An object with these fields

- **start** - a string with the start positions for each rotor expressed as a
letter
- **decoded** - the clear text version of the message
- **encoded** - the encoded string using the given `Enigma` instance


### **Example**

```javascript
    function generateForModel(model, count, list) {
        let {reflectors, rotors, fixed} = generator.getModelOptions(model);
        let enigma = generator.createRandomEnigma(model, reflectors)

        for (let idx = 0; idx < count; idx++) {
            let configuration = generator.generateEnigmaConfiguration({rotors, fixed});
            enigma.configure(configuration);

            let message = generator.generateMessage(enigma);

            list.push({model, ...message});
        }
    }

    let messages = [];

    generateForModel('I', 5, messages);
    generateForModel('M3', 5, messages);
    generateForModel('M4', 5, messages);
```

## CodeBook

Use this class to create [key sheets](https://www.ciphermachinesandcryptology.com/en/enigmaproc.htm)
and messages using those key sheets.

### Key sheet
A key sheet specifies how to configure the enigma machine each day for a whole
month. It consisted of one line per day, sorted from the last day of the month
until the first. Each line had these columns:

- **date (Datum)** - the numerical day of the month
- **rotor setup (Walzenlage)** - the rotors to use
- **ring settings (Ringstellung)** - the ring setting for each rotor
- **plugboard configuration (Steckerverbindungen)** - how the ten plugs where
connected to the plugboard
- **indicators (Kenngruppen)** - a set of four three digits codes that were an
index into the specific day

---
### **Methods**

`constructor(enigma)`

This is the constructor for the `CodeBook`. Each instance of this class works
with an instance of the `Enigma` class.

#### **Parameters**
- **enigma** - the `Enigma` instance to use.

---
`configure(config)`

Call this method to configure the `Enigma` used by this instance.

#### **Parameters**

- **config** - the simplified configuration returned by `Generator.generateEnigmaConfiguration`.
it has these fields.
    - **rotors** - the rotors to install
    - **plugs** - the plug board configuration as a string if space separated pairs
    - **ringSettings** - an array of numbers for the ring setting for each rotor


---
`generateKeySheet(days)`

Call this method to generate a monthly key sheet. This is the same data that
would have been used by officers to setup the Enigma every day. The key sheet
is created based on the enigma instance

#### **Parameters**
- **days** The number of days to generate data for

#### **Returns**
An array of objects, each one with these fields

- **day** the day of the month
- **rotors** an array of three rotor names
- **ringSettings** an array of offsets for the ring settings
- **plugs** 10 pairs of letters that will be used as connections on the plug
    board
- **indicators** and array of four three-letter strings. These strings will be
    unique across the key sheet


---
`generateMessage(sheet, dayIdx, text)`

Call this method to generate a message using the given key sheet. Each message has
the same information that a message in the field would possess. The construction
of the message follow the the standards of the German military beginning in
1940. They are as follows:

>The Wehrmacht radio operator sets each day the rotors, ring settings and
plugboard according to the key sheet. For each new message, he now selects new
randomly chosen start position or Grundstellung, say WZA, and a random message
key or Spruchschlüssel, say SXT. He moves the rotors to the random start
position WZA and encrypts the random message key SXT...
>
>He then sets message key SXT as start position of the rotors and encrypts the
actual message. Next, he transmits the random start position WZA, the encrypted
message key RSK and the Kenngruppe FDJKM together with his message.
>
>--[Enigma Message Procedures](https://www.ciphermachinesandcryptology.com/en/enigmaproc.htm)

The first five characters of each message was used to specify one of the four
key identifiers from the key sheet that defines the Enigma configuration. The
first two characters of this group were randomly chosen, and the last three were
one of the key identifiers for that daily setup. This text was not encrypted.


#### **Parameters**
- **sheet** - the key sheet to use
- **dayIdx** (optional) - if specified the zero-based day to use, defaults to
a random day
- **text** (optional) - if provided will be used as the text of the message.
Defaults to between two and five contiguous lines from Hamlet

#### **Returns**
The configuration of the Enigma and an array of sub messages, which could be
longer than one for large messages.

The returned object has these fields
- **options**- the configuration used to generate the message
    - **rotors** - the installed rotors to install
    - **plugs** - the plug board configuration as a string of space separated pairs
    - **ringSettings** - an array of numbers for the ring setting for each rotor
    - **reflector**- the installed reflector
- **parts** - an array of sub messages, each with these fields
    - **key** - a randomly chosen key, this would be transmitted with the message
    - **enc** - the encoded start position for the message. This was encoded using
    the randomly chosen key. This was sent with the message
    - **text** - the message text encoded using the unencoded start position. The
        first five letters of this text string included the unencrypted key
        identifier.
    - **start** - the unencoded start position. This was not sent with the message but
        is included here to verify an implementation of this method.
    - **clear** - the unencrypted message. This can be used to verify an
        implementation of this method.

---
`generateMessages(sheet, count)`

Call this method to create an array of messages based off a key sheet. This
method calls `generateMessage` count times.

#### **Parameters**
- **sheet** - a key sheet as generated from `generateKeySheet`
- **count** - the number of messages to create

#### **Returns**
An array of messages as returned from `generateKeySheet`

#### **Example Message**

```json
{
    "options": {
        "reflector": "A",
        "rotors": [
            "IV",
            "III",
            "II"
        ],
        "ringOffsets": [
            25,
            11,
            18
        ],
        "plugs": "AV XQ YK TD HE OB ZW FP IU CM"
    },
    "parts": [
        {
            "key": "VAH",
            "enc": "WFL",
            "start": "ZKY",
            "text": "PYVJF SVGQI FUNUE RVYRN BPTJL TGGPW CAWXU NBAZS BTNUV XVEPE QOQGP AKMJM ILBYA MKMXD NVJMO HBVJB HBRZX QSPQX DFIBG JXOHN KQXTI OJBUP JWBCF UOMGJ XUJPP XBJEM LVKMA LZSKO VSOEC NIJFV TRLAO JLVOO TMQDU TYSWL HIAPE YYAQD QKANA IHVSG JMJIC MZOSP POWJI IZJMF VKARE YINLU SYBZY XKWAC UIHVO MKCFH BEPUG LAXWP ",
            "clear": "HEMADECONFESSIONOFYOUANDGAVEYOUSUCHAMASTERLYREPORTFORARTANDEXERCISEINYOURDEFENCEANDFORYOURRAPIERMOSTESPECIALLYTHATHECRIEDOUTTWOULDBEASIGHTINDEEDIFONECOULDMATCHYOUTHESCRIMERSOFTHEIRNATIONHESWOREHADHADNEITHERMOTIONGUARDNOREYEIFYOUOPPOSEDTHEMSIRTHI"
        },
        {
            "key": "TBR",
            "enc": "AZP",
            "start": "CBC",
            "text": "RRRNG VYBRV RPVBF KFHAJ TPUHW WGZJU BWXGH LGNKW RYZYP DGBYC SUTEX KJSUX UDWER YJHDB HDSZH PARUG EPDXE YXBDX TBCKD JKYDY VLZVV ACYVD MTLEC BSQEP ACKVV YKJAZ SHQQT GMBQB T",
            "clear": "REPORTOFHISDIDHAMLETSOENVENOMWITHHISENVYTHATHECOULDNOTHINGDOBUTWISHANDBEGYOURSUDDENCOMINGOERTOPLAYWITHHIMNOWOUTOFTHISWHATOUTOFTHISMYLORD"
        }
    ]
}
```
