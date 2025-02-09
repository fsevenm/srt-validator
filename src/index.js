import SRTParser from './parser';
import CaptionTimeSpanValidator from './validators/caption-time-span-validator';
import LineNumberValidator from './validators/line-number-validator';

function runValidator(Validators, parsedObj) {
  return Validators.map((Validator) => {
    const validator = new Validator(parsedObj);
    return validator.validate();
  }).reduce((acc, cur) => {
    acc.push(...cur);
    return acc;
  }, []);
}

function srtValidator(srtString) {
  const result = [];
  let parsedObj;

  try {
    parsedObj = SRTParser.parse(srtString);
  } catch (error) {
    // grab the details from the ParseError
    const { message, lineNumber, errorCode } = error;
    result.push({ message, lineNumber, errorCode });
  }

  if (result.length) {
    return result;
  }

  result.push(
    ...runValidator([LineNumberValidator, CaptionTimeSpanValidator], parsedObj)
  );

  return result.sort((a, b) => a.lineNumber - b.lineNumber);
}

export const validator = srtValidator;
export const parser = SRTParser;

// Default validator for backwards compatibility
export default srtValidator;
