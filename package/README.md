<div  style="text-align: right">
    <img src="./enigma-toolkit-logo.png" height="100"/>
</div>

# Getting Started

The Enigma toolkit is released as a nodejs ESM module. ESM is a relatively new
standard for importing modules, and can present challenges to developers who
need to mix the two. Using CJS modules in an ESM project is pretty straight
forward, but the opposite is not true. Here is a good page that covers this
issue [Mixing ESM and CJS](https://adamcoster.com/blog/commonjs-and-esm-importexport-compatibility-examples).
To work with this code, your best bet is to create your own project also as ESM,
by either renaming your files with the extension mjs, or adding
```"type": "module"``` to your package.js file.

To install the module, use the command:

```npm install @ondoher/enigma```

You can then import this into your code like this:

```JavaScript
import {Enigma} from '@ondoher/enigma';

var enigma = new Enigma({reflector: 'B'});
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

`function (event, name, message, info)`

### **Parameters**
- **event** a string that identifies the specific action being taken.
- **name** the name of the class instance that has fired this event
- **message** a string that describes the event taking place
- **info** an object that contains information relevant to the event

The specific events and data are defined in the class documentation that
follows.

## PlugBoard
Create an instance of this class to simulate the plug board component of an
Enigma.

### **Methods**

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

`configure(settings)`

Call this method to configure the plug board. This must be called even if there
are no plug connections.

#### **Parameters**
- **settings** these are the settings to configure the plug board.
    - _plugs_ (optional) either an array of strings or a single string. If it
    is a string, it must be a space separated list of letter pairs that
    connects one input letter to another. If it is an array then then each item
    is a pair of letters to specify how the plugs are connected

`encode(direction, input)`

Call this method to encode a value in the given direction, right vs left.

#### **Parameters**
- **direction** `right` when moving towards the reflector `left` when moving
    back
- **input** this is the input connector.

#### **Returns**
the output connector

#### **Events**

`encode-right, encode-left`

These events will be fired during encoding. The info parameter will have these
fields.

- **input** the number of the connector that received input
- **output** the number of the connector for the encoded value

## Rotor

Create an instance of this class to construct a Rotor object. The Rotor class
encapsulates many of the peculiar behaviors of the Enigma. All connector values
here are specified in physical space. See the [documentation](./docs/enigma.md)
for an explanation.

### **Methods**

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

`setStartPosition(connector)`

Call this method to set the starting rotation for encoding.

#### **Parameters**
- **connector** This is a letter value that corresponds to what would appear in
the rotation window. This value will be adjusted for the ring setting.

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

`step()`

Call this method to step the rotor

#### **Returns**
true if the next rotor should be stepped

`willTurnover()`
Call this method to see if the next step on this rotor will lead to turn over.
The Enigma class will call this on the middle rotor to handle double stepping.

#### **Returns**
true if the next step will cause turnover

`isfixed()`

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

### **Events**

`encode`

This event will be fired during encoding. The info parameter will have these
fields.

- **input** the number of the connector that received input
- **output** the number of the connector for the encoded value

## Enigma

Create an instance of this class to construct a full Enigma.

### **Methods**

`constructor(settings)`

The constructor for the Enigma.

#### **Parameters**
- **settings** The settings here are for the unconfigurable options of the
    device.
    - _alphabet_ (optional) set this to a string of letters that are an
    alternative to the standard A-Z. Defaults to A-Z
    - _entryDisk_ (optional) the name of entry disc in the inventory this
    defaults to 'default'
    - _reflector_ for the Enigma I or M3 this specifies one of three possible
    standard reflectors from the inventory which are A, B, and C. For the M4,
    Thin-B and Thin-C have been defined.

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

`step()`

Call this method to step the Enigma. This will rotate the first rotor to the
right and step and double step when necessary.

`setStart(start)`

#### **Parameters**
- **start** this is either a string of an array of numbers. The length of the
    string or the array should match the number of rotors and are given left to
    right. If start is a string then the letters of the string specify the start
    value seen in the window for the corresponding rotor. If it is an array then
    each number will be the one-based rotation value.

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

`encode(start, text)`

Call this method to encode a whole string.

#### **Parameters**
- **start** the start positions for the rotors. This parameter is the same as
    what's passed to `setStart`.
- **text** This is the string to be encoded. Any characters in this string that
    are not part of the defined alphabet are ignored.

#### **Returns**
the encoded string. Passing the result of this method back through the encode
    method should produce the original text.

### **Events**

In addition to firing all the events from its components, the Enigma will also
fire these events.

`input`

This is fired at the beginning of encoding each letter. It is fired after
verifying the letter, but before stepping. The info parameter contains these
fields.

- **letter** the letter to be encoded

`output`

This is fired after encoding each letter. The info parameter contains these
fields.

- **letter** the encoded letter.

### **Example**

```javascript
import {Enigma} from '@ondoher/enigma';

var enigma = new Enigma({reflector: 'B'});

enigma.configure({
    rotors: ['III', 'VI', 'VIII'],
    ringSetting: [1, 8, 13],
    plugs: 'AN EZ HK IJ LR MQ OT PV SW UX'
});

var message = 'YKAENZAPMSCHZBFOCUVMRMDPYCOFHADZIZMEFXTHFLOLPZLFGGBOTGOXGRETDWTJIQHLMXVJWKZUASTR'
var decoded = enigma.encode('UZV', message)

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

`addReflector(name, map)`

Call this method to add a new reflector definition.

#### **Parameters**
- **name** this is the name that will be used to reference this reflector when
    constructing an Enigma class.
- **map** this uses the same format used in the `addRotor` method

`addEntryDisc(name, map)`

Call this method to add a new entry disc. There was only one used in the
standard military models, but there were other versions that defined it
differently.

#### **Parameters**
- **name** this is the name that will be used to reference this entry disc when
    constructing an Enigma class.
- **map** this uses the same format used in the `addRotor` method

`getRotor(name)`

Call this method to get the setup for a defined rotor.

#### **Parameters**
- **name** the name of the rotor as it was added to the inventory.

#### **Returns**
an object with these fields
- **map** the connection map for the rotor
- **turnovers** the locations where turnovers happen

`getReflector(name)`

Call this method to get the setup for a defined reflector.

#### **Parameters**
- **name** the name of the reflector as it was added to the inventory.

#### **Returns**
an object with these fields
- **map** the connection map for the reflector

`getEntryDisc(name)`

Call this method to get the setup for a defined entry disc.

#### **Parameters**
- **name** the name of the entry disk as it was added to the inventory.

#### **Returns**
an object with these fields
- **map** the connection map for the entry disc

# Message Generator

The message generator API consists of a single class `Generator` which is used
to generate random test data.

## Generator

### **Methods**

`generateEncodedText(settings)`

Call this method to generate some random text encoded with a random Enigma
configuration. The random text will be a few sentences from Hamlet.

#### **Parameters**
- **settings** (optional), alternative configuration settings for the Enigma
    - _rotors_ (optional) alternate list of rotors to choose from. Defaults to
        all defined rotors
    - _fixed_ (optional) an array of fixed rotors to choose from. Defaults to
        an empty list
    - _reflectors_ (optional) an array of reflectors to choose from. Defaults to
        A, B and C

#### **Returns**
the generated text and meta data. This is an object with these fields

- **setup** how the Enigma was configured
    - _rotors_  an array of three rotor names, four if a fixed list was given
        in the settings
    - _ringSettings_ an array of offsets for the ring settings
    - _plugs_  10 pairs of letters that will be used as connections on the plug
        board
    - _reflector_ which reflector was configured

- **start** three letter or four string with the starting rotor offsets used to
    encode the text.
- **message** the encoded text
- **clear** the unencoded text. This is provided to validate the simulation
    result

#### **Example**

```JavaScript
// Generate messages for the Enigma Model I
function generateI(count, list) {
    for (let idx = 0; idx < count; idx++) {
        let message = generator.generateEncodedText({
            rotors: ['I', 'II', 'III', 'IV', 'V'],
            reflectors: ['A', 'B', 'C'],
        })
        list.push({model: 'I', ...message});
    }
}
```

`generateEnigmaSetup(settings)`

Call this method to generate a random Enigma setup. This includes only the
configurable items, it does not include the details of the machine itself.

#### **Parameters**
- **settings** (optional), alternative configuration settings for the Enigma
    - _rotors_ (optional) alternate list of rotors to choose from. This will
        default to all defined rotors except those that are fixed.
     _fixed_ (optional) an array of fixed rotors to choose one from. Defaults to
        an empty list

#### **Returns**
the generated settings. This is an obejct with these fields

- **rotors** an array of three rotor names, four if fixed was given in the
    settings
- **ringSettings** an array of offsets for the ring settings
- **plugs** 10 pairs of letters that will be used as connections on the plug
    board

`generateKeySheet(days)`

Call this method to generate a monthly key sheet. This is the same data that
would have been used by officers to setup the Enigma every day. The keysheet
is generated for an M3 (rotors I-VIII) using reflector B

#### **Parameters**
- **days** The number of days to generate data for

#### **Returns**
the key sheet which is an array of objects, each one with these fields

- **day** the day of the month
- **rotors** an array of three rotor names
- **ringSettings** an array of offsets for the ring settings
- **plugs** 10 pairs of letters that will be used as connections on the plug
    board
- **indicators** and array of four three-letter strings. These strings will be
    unique across the key sheet

`generateMessages(sheet, count)`

Call this method to create an array of messages based off a key sheet. This has
the same informaton that a message in the field would possess. The construction
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
- **sheet** a key sheet as generated from `generateKeySheet`
- **count** the number of messages to create

#### **Returns**
an array of messages. Each message is an array of sub messages. A message was
broken down into text blocks that were no longer than 250 characters and sent
in multiple parts. These sub messages were sent using a unique key and start
position. These are the fields in a sub message.

- **key** a randomly chosen key, this would be transmitted with the message
- **enc** the encoded start position for the message. This was encoded using
    the randomly chosen key. This was sent with the message
- **text** the message text encoded using the unencoded start position. The
    first five letters of this text string included the unencrypted key
    identifier.
- **start** the unencoded start position. This was not sent with the message but
    is included here to verify an implementation of this method.
- **clear** the unencrypted message. This can be used to verify an
    implementation of this method.

#### **Example Message**

```json
[
    {
        "key": "YSR",
        "enc": "MHH",
        "start": "GJC",
        "text": "OAYXJ CTCBV BZRBS SORIL YVMMM LLIVS OBUYU VMQTJ GFSZU XYUDR GHKRX KRCDV QEZCH MDTAJ KZUXV TZPOA VSCFH ILWQC DJNAH PILTN MMLHK OULDS QIMCB NMTRZ OQFQY CVWVW QXEHU WCMKJ XGUSA YPBIE EXGKZ LZLUF NMJNB ISUWN DYOWW XUJNK VUYOV SJOSW MQNSP MUTAZ DQIXV RGJXM ",
        "clear": "WHATD EVILW ASTTH ATTHU SHATH COZEN DYOUA THOOD MANBL INDEY ESWIT HOUTF EELIN GFEEL INGWI THOUT SIGHT EARSW ITHOU THAND SOREY ESSME LLING SANSA LLORB UTASI CKLYP ARTOF ONETR UESEN SECOU LDNOT SOMOP EOSHA MEWHE REIST HYBLU SHREB ELLIO USHEL LIFTH"
    },
    {
        "key": "MYR",
        "enc": "AJI",
        "start": "ETH",
        "text": "OAYXJ WPIFA NPUKR ZWSZG GXYZX ZYTMQ PHVNB CPHUA XEUVC VOGUZ LPQSP RFHTK ZNFHL OYGEU ZGOPG EFBTL ORNDH INNGD LDIAT DDPOP QZZKE XBUWI VCJOW LWDJO BLASV JTOMG LUDRC LIISC DJZES QZSSD GBYSG PUGHS EWADO KDSFP ZOLBL RPEYX YKQTF HOI",
        "clear": "OUCAN STMUT INEIN AMATR ONSBO NESTO FLAMI NGYOU THLET VIRTU EBEAS WAXAN DMELT INHER OWNFI REPRO CLAIM NOSHA MEWHE NTHEC OMPUL SIVEA RDOUR GIVES THECH ARGES INCEF ROSTI TSELF ASACT IVELY DOTHB URNAN DREAS ONPAN DERSW ILL"
    }
]
```
