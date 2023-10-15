import {Block} from 'baseui/block'
import {Heading, HeadingLevel} from 'baseui/heading';
import {ParagraphLarge} from 'baseui/typography';
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";

interface QuoteProps {
    text: string;
    author: string;
}

export const Quote = ({ text, author }: QuoteProps) => {
    return (
        <Block style={{paddingLeft: '10%', paddingRight: '10%'}}>
            {text && <>
                <HeadingLevel>
                    <Heading styleLevel={2}>
                        <ImQuotesLeft style={{ marginRight: '2%'}} />
                        {text}
                        <ImQuotesRight style={{ marginLeft: '2%'}} />
                    </Heading>
                </HeadingLevel>
                <ParagraphLarge>
                    {author}
                </ParagraphLarge>
            </>
            }
        </Block>
    );
}